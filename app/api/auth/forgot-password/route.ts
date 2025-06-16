import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { User } from "@/lib/models"
import { emailService } from "@/lib/services/email"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    console.log("=== FORGOT PASSWORD API CALLED ===")

    const { email } = await request.json()
    console.log("Received email:", email)

    if (!email) {
      console.log("Error: No email provided")
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("Error: Invalid email format")
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    console.log("Connecting to database...")
    await connectToDatabase()

    // Find user by email
    console.log("Looking for user with email:", email.toLowerCase())
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      console.log("User not found, but returning success for security")
      // For security, we don't reveal if the email exists or not
      return NextResponse.json(
        { message: "If an account with that email exists, we've sent a password reset link." },
        { status: 200 },
      )
    }

    console.log("User found:", user.email)

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    console.log("Generated reset token:", resetToken)
    console.log("Token expires at:", resetTokenExpiry)

    // Save reset token to user
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = resetTokenExpiry
    await user.save()

    console.log("Reset token saved to user")

    // Prepare reset URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`

    console.log("Reset URL:", resetUrl)
    console.log("Environment variables check:")
    console.log("- NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL)
    console.log("- MAILTRAP_HOST:", process.env.MAILTRAP_HOST)
    console.log("- MAILTRAP_PORT:", process.env.MAILTRAP_PORT)
    console.log("- MAILTRAP_USER:", process.env.MAILTRAP_USER ? "SET" : "NOT SET")
    console.log("- MAILTRAP_PASS:", process.env.MAILTRAP_PASS ? "SET" : "NOT SET")
    console.log("- MAILTRAP_FROM_EMAIL:", process.env.MAILTRAP_FROM_EMAIL)

    // Send reset email
    try {
      console.log("Attempting to send password reset email...")

      const emailResult = await emailService.sendPasswordReset(user.email, {
        name: user.name,
        resetUrl,
        token: resetToken,
      })

      console.log("Email service result:", emailResult)

      if (!emailResult.success) {
        console.error("Email sending failed:", emailResult.error)

        // Clear the reset token if email fails
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()

        return NextResponse.json(
          {
            error: "Failed to send reset email. Please try again.",
            details: emailResult.error,
          },
          { status: 500 },
        )
      }

      console.log("Password reset email sent successfully")
      return NextResponse.json(
        {
          message: "Password reset email sent successfully",
          messageId: emailResult.messageId,
        },
        { status: 200 },
      )
    } catch (emailError) {
      console.error("Error sending reset email:", emailError)

      // Clear the reset token if email fails
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save()

      return NextResponse.json(
        {
          error: "Failed to send reset email. Please try again.",
          details: emailError instanceof Error ? emailError.message : "Unknown email error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Forgot password API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
