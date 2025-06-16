import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { User } from "@/lib/models"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const { name, email, phone, password } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      // User exists, return user info for auto-login
      return NextResponse.json({
        success: true,
        userExists: true,
        user: {
          _id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          phone: existingUser.phone,
        },
      })
    }

    // Generate a random password if not provided
    const userPassword = password || Math.random().toString(36).slice(-8)
    const hashedPassword = await bcrypt.hash(userPassword, 10)

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "user",
      isGuestRegistered: true, // Flag to indicate this was a guest registration
    })

    await user.save()

    return NextResponse.json({
      success: true,
      userExists: false,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      generatedPassword: password ? null : userPassword, // Only return if we generated it
    })
  } catch (error) {
    console.error("Error in guest registration:", error)
    return NextResponse.json({ error: "Failed to process registration" }, { status: 500 })
  }
}
