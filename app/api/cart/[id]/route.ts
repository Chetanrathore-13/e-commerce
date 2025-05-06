import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { Cart, Variation } from "@/lib/models"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import mongoose from "mongoose"

// Update cart item quantity
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const itemId = params.id

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 })
    }

    const { quantity } = await request.json()

    if (!quantity || quantity <= 0) {
      return NextResponse.json({ error: "Quantity must be greater than 0" }, { status: 400 })
    }

    // Find cart
    const cart = await Cart.findOne({ user_id: userId })

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId)

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 })
    }

    // Check if quantity is valid
    const variation = await Variation.findById(cart.items[itemIndex].variation_id)

    if (!variation) {
      return NextResponse.json({ error: "Variation not found" }, { status: 404 })
    }

    if (quantity > variation.quantity) {
      return NextResponse.json({ error: "Not enough stock available" }, { status: 400 })
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity

    // Recalculate total
    cart.total = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

    await cart.save()

    return NextResponse.json({ message: "Cart item updated" })
  } catch (error) {
    console.error("Error updating cart item:", error)
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
  }
}

// Remove item from cart
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const itemId = params.id

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 })
    }

    // Find cart
    const cart = await Cart.findOne({ user_id: userId })

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    // Remove item from cart
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId)

    // Recalculate total
    cart.total = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

    await cart.save()

    return NextResponse.json({ message: "Item removed from cart" })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ error: "Failed to remove item from cart" }, { status: 500 })
  }
}
