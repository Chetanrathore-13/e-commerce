import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import {  Product, Variation } from "@/lib/models"
import Cart from "@/lib/models/cart"
import Order from "@/lib/models/order"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import mongoose from "mongoose"

// Get user's orders
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

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

// Create a new order
export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const data = await request.json()

    // Validate required fields
    if (!data.shipping_address || !data.billing_address || !data.payment_method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user's cart
    const cart = await Cart.findOne({ user_id: userId }).lean()
    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Prepare order items
    const orderItems = []
    let subtotal = 0

    for (const item of cart.items) {
      try {
        const product = await Product.findById(item.product_id).lean()
        const variation = await Variation.findById(item.variation_id).lean()

        if (!product || !variation) {
          continue
        }

        // Check if item is still in stock
        if (variation.quantity < item.quantity) {
          return NextResponse.json(
            {
              error: `Not enough stock for ${product.name} (${variation.color}, ${variation.size})`,
            },
            { status: 400 },
          )
        }

        // Add item to order
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

        // Update subtotal
        subtotal += item.price * item.quantity

        // Update product variation quantity
        await Variation.findByIdAndUpdate(item.variation_id, {
          $inc: { quantity: -item.quantity },
        })
      } catch (err) {
        console.error("Error processing cart item:", err)
      }
    }

    if (orderItems.length === 0) {
      return NextResponse.json({ error: "No valid items in cart" }, { status: 400 })
    }

    // Apply discount if coupon is provided
    let discountAmount = 0
    if (data.coupon_code && data.discount_amount) {
      discountAmount = data.discount_amount
    }

    // Calculate final total
    const total = subtotal - discountAmount

    // Generate order number
    const orderCount = await Order.countDocuments()
    const orderNumber = `ORD${new Date().getFullYear()}${(orderCount + 1).toString().padStart(6, "0")}`

    // Create order
    const order = new Order({
      user_id: new mongoose.Types.ObjectId(userId),
      order_number: orderNumber,
      items: orderItems,
      total,
      subtotal,
      discount: discountAmount,
      coupon_code: data.coupon_code || null,
      status: "pending",
      shipping_address: data.shipping_address,
      billing_address: data.billing_address,
      payment_method: data.payment_method,
      payment_status: data.payment_method === "cod" ? "pending" : "processing",
    })

    await order.save()

    // Clear the cart after successful order
    await Cart.findOneAndUpdate({ user_id: userId }, { $set: { items: [], total: 0 } })

    return NextResponse.json({
      message: "Order placed successfully",
      order: {
        _id: order._id,
        order_number: order.order_number,
        total: order.total,
      },
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
