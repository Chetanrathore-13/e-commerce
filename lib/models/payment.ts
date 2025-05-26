import mongoose, { Schema, type Document } from "mongoose"

export interface IPayment extends Document {
  orderId: string
  userId: string
  merchantTransactionId: string
  transactionId?: string
  amount: number
  currency: string
  paymentMethod: string
  status: "pending" | "completed" | "failed" | "cancelled"
  phonepeResponse?: any
  createdAt: Date
  completedAt?: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: String, required: true },
    userId: { type: String, required: true },
    merchantTransactionId: { type: String, required: true, unique: true },
    transactionId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    phonepeResponse: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true },
)

export default mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema)
