import { type NextRequest, NextResponse } from "next/server"
import { PhonePeService } from "@/lib/services/phonepe"
import Payment from "@/lib/models/payment"
import Order from "@/lib/models/order"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { response, checksum } = body

    if (!response || !checksum) {
      return NextResponse.json({ error: "Invalid callback data" }, { status: 400 })
    }

    // Initialize PhonePe service
    const phonePeService = new PhonePeService()

    // Verify callback
    const isValid = phonePeService.verifyCallback(response, checksum)
    if (!isValid) {
      console.error("PhonePe callback verification failed")
      return NextResponse.json({ error: "Invalid callback" }, { status: 400 })
    }

    // Decode response
    const decodedResponse = JSON.parse(Buffer.from(response, "base64").toString())
    const { merchantTransactionId, transactionId, amount, state, responseCode } = decodedResponse

    // Find payment record
    const payment = await Payment.findOne({ merchantTransactionId })
    if (!payment) {
      console.error("Payment record not found:", merchantTransactionId)
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 })
    }

    // Update payment status
    let paymentStatus = "failed"
    let orderStatus = "pending"

    if (state === "COMPLETED" && responseCode === "SUCCESS") {
      paymentStatus = "completed"
      orderStatus = "processing"
    } else if (state === "FAILED") {
      paymentStatus = "failed"
      orderStatus = "cancelled"
    } else if (state === "PENDING") {
      paymentStatus = "pending"
      orderStatus = "pending"
    }

    // Update payment record
    await Payment.findByIdAndUpdate(payment._id, {
      status: paymentStatus,
      transactionId,
      phonepeResponse: decodedResponse,
      completedAt: paymentStatus === "completed" ? new Date() : null,
    })

    // Update order status
    if (payment.orderId) {
      await Order.findByIdAndUpdate(payment.orderId, {
        payment_status: paymentStatus === "completed" ? "paid" : "pending",
        status: orderStatus,
      })
    }

    console.log(`Payment ${merchantTransactionId} updated to ${paymentStatus}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PhonePe callback processing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
