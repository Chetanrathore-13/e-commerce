import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { Cart, Product, Variation, Order } from "@/lib/models"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import mongoose from "mongoose"

// Generate a unique order number
function generateOrderNumber() {
  const timestamp = new Date().getTime().toString().slice(-8)
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `ORD-${timestamp}-${random}`
}

export async function GET() {
  try {
    await connectToDatabase()

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Find orders for the user
    const orders = await Order.find({ user_id: userId }).sort({ createdAt: -1 }).lean()

    // Format orders for response
    const formattedOrders = orders.map((order) => ({
      ...order,
      _id: order._id.toString(),
      user_id: order.user_id.toString(),
      items: order.items.map((item) => ({
        ...item,
        product_id: item.product_id.toString(),
        variation_id: item.variation_id.toString(),
      })),
    }))

    return NextResponse.json({ orders: formattedOrders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { shipping_address, billing_address, payment_method } = await request.json()

    // Validate required fields
    if (!shipping_address || !billing_address || !payment_method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user's cart
    const cart = await Cart.findOne({ user_id: userId })

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Verify stock availability and prepare order items
    const orderItems = []

    for (const item of cart.items) {
      // Check if product and variation exist and have enough stock
      const product = await Product.findById(item.product_id)
      const variation = await Variation.findById(item.variation_id)

      if (!product || !variation) {
        return NextResponse.json(
          {
            error: `Product or variation not found for item ${item._id}`,
          },
          { status: 400 },
        )
      }

      if (variation.quantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Not enough stock available for ${product.name} (${variation.size}, ${variation.color})`,
          },
          { status: 400 },
        )
      }

      // Prepare order item
      orderItems.push({
        product_id: item.product_id,
        variation_id: item.variation_id,
        quantity: item.quantity,
        price: item.price,
        name: product.name,
        image: variation.image,
        size: variation.size,
        color: variation.color,
      })

      // Update product variation quantity
      variation.quantity -= item.quantity
      await variation.save()
    }

    // Create order
    const order = new Order({
      user_id: new mongoose.Types.ObjectId(userId),
      order_number: generateOrderNumber(),
      items: orderItems,
      total: cart.total,
      status: "pending",
      shipping_address,
      billing_address,
      payment_method,
      payment_status: "pending", // Assuming payment will be handled separately
    })

    await order.save()

    // Clear user's cart after successful order
    cart.items = []
    cart.total = 0
    await cart.save()

    // Format order for response
    const formattedOrder = {
      ...order.toObject(),
      _id: order._id.toString(),
      user_id: order.user_id.toString(),
      items: order.items.map((item) => ({
        ...item.toObject(),
        product_id: item.product_id.toString(),
        variation_id: item.variation_id.toString(),
      })),
    }

    return NextResponse.json({
      message: "Order placed successfully",
      order: formattedOrder,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
