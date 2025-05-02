import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import { connectToDatabase } from "@/lib/mongodb"
import { User } from "@/lib/models"
import { z } from "zod"

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { name, email, password } = userSchema.parse(body)

    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    // Remove password from response
    const newUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    }

    return NextResponse.json({ user: newUser, message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Registration error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
