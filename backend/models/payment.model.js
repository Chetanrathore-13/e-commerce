import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    transaction_id: { type: String, unique: true },
    payment_method: { type: String, enum: ['UPI', 'Credit', 'Debit Card', 'Net Banking'] },
    payment_status: { type: String, enum: ['Pending', 'Success', 'Failed'] },
    payment_date: Date
  },{ timestamps: true });

export default mongoose.model("Payment", PaymentSchema)