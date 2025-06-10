import mongoose from "mongoose"

const PaymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  merchantTransactionId: {
    type: String,
    required: true,
    unique: true,
  },
  transactionId: {
    type: String,
    sparse: true, // Allows multiple null values
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "INR",
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["phonepe", "phonepe_refund", "cod", "credit-card", "paypal", "bank-transfer", "razorpay"],
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "completed", "failed", "cancelled", "refunded"],
    default: "pending",
  },
  // PhonePe specific fields
  phonepeResponse: {
    type: mongoose.Schema.Types.Mixed,
  },
  // Razorpay specific fields
  razorpayOrderId: {
    type: String,
    sparse: true,
  },
  razorpayPaymentId: {
    type: String,
    sparse: true,
  },
  razorpaySignature: {
    type: String,
  },
  razorpayResponse: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
})

// Index for faster queries
PaymentSchema.index({ merchantTransactionId: 1 })
PaymentSchema.index({ userId: 1, createdAt: -1 })
PaymentSchema.index({ orderId: 1 })
PaymentSchema.index({ razorpayOrderId: 1 })
PaymentSchema.index({ razorpayPaymentId: 1 })

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema)
