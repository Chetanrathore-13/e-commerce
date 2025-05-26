import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { emailService } from "@/lib/services/email"

export async function POST(request: Request) {
  try {
    console.log("Email send API called")

    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      console.log("Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("User authenticated:", session.user.email)

    // Parse request body
    let body
    try {
      body = await request.json()
      console.log("Request body parsed:", { ...body, data: body.data ? "present" : "missing" })
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { to, type, data } = body

    if (!to || !type) {
      console.log("Missing required fields:", { to: !!to, type: !!type })
      return NextResponse.json({ error: "Recipient email and type are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      console.log("Invalid email format:", to)
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    console.log("Sending email:", { to, type })

    let result
    try {
      switch (type) {
        case "newsletter":
          result = await emailService.sendNewsletter(to, data)
          break
        case "welcome":
          result = await emailService.sendWelcomeEmail(to, data)
          break
        case "order-confirmation":
          result = await emailService.sendOrderConfirmation(to, data)
          break
        case "order-shipped":
          result = await emailService.sendOrderShipped(to, data)
          break
        case "password-reset":
          result = await emailService.sendPasswordReset(to, data)
          break
        default:
          console.log("Unknown email type:", type)
          return NextResponse.json({ error: "Unknown email type" }, { status: 400 })
      }

      console.log("Email service result:", result)

      if (result.success) {
        return NextResponse.json({
          message: "Email sent successfully",
          messageId: result.messageId,
        })
      } else {
        console.error("Email service failed:", result.error)
        return NextResponse.json({ error: result.error || "Failed to send email" }, { status: 500 })
      }
    } catch (emailError) {
      console.error("Error in email service:", emailError)
      return NextResponse.json(
        { error: `Email service error: ${emailError instanceof Error ? emailError.message : "Unknown error"}` },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Unexpected error in email send API:", error)
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
