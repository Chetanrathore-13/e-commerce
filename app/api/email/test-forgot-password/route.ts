import { NextResponse } from "next/server"
import { emailService } from "@/lib/services/email"

export async function POST() {
  try {
    console.log("=== TESTING FORGOT PASSWORD EMAIL ===")

    // Test data
    const testEmail = "test@example.com"
    const testResetData = {
      name: "Test User",
      token: "test-token-123456789",
      resetUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=test-token-123456789`,
    }

    console.log("Test email:", testEmail)
    console.log("Test reset data:", testResetData)

    // Send test email
    const result = await emailService.sendPasswordReset(testEmail, testResetData)

    console.log("Test email result:", result)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test forgot password email sent successfully!",
        messageId: result.messageId,
        resetUrl: testResetData.resetUrl,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Test email error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
