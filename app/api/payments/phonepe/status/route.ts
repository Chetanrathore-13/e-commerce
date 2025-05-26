import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PhonePeService } from "@/lib/services/phonepe"
import Payment from "@/lib/models/payment"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const merchantTransactionId = searchParams.get("txnId")

    if (!merchantTransactionId) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 })
    }

    // Find payment record
    const payment = await Payment.findOne({ merchantTransactionId })
    if (!payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 })
    }

    // Check if user owns this payment
    if (payment.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Initialize PhonePe service
    const phonePeService = new PhonePeService()

    // Check payment status with PhonePe
    const response = await phonePeService.checkPaymentStatus(merchantTransactionId)

    if (response.success && response.data) {
      const { state, responseCode, amount, transactionId } = response.data

      // Update payment status based on PhonePe response
      let paymentStatus = "failed"
      if (state === "COMPLETED" && responseCode === "SUCCESS") {
        paymentStatus = "completed"
      } else if (state === "PENDING") {
        paymentStatus = "pending"
      }

      // Update payment record
      await Payment.findByIdAndUpdate(payment._id, {
        status: paymentStatus,
        transactionId,
        phonepeResponse: response.data,
        completedAt: paymentStatus === "completed" ? new Date() : null,
      })

      return NextResponse.json({
        success: true,
        data: {
          merchantTransactionId,
          transactionId,
          status: paymentStatus,
          amount: amount / 100, // Convert from paise to rupees
          state,
          responseCode,
        },
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: response.message || "Failed to check payment status",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("PhonePe status check error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
