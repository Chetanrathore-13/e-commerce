import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    total_price: Number,
    discount_code_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount_Code', default: null },
    payment_method: { type: String, enum: ['COD', 'UPI', 'Credit', 'Debit Card'] },
    order_status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'] },
    tracking_number: { type: String, default: null },
    created_at: String
  },{ timestamps: true });

export default mongoose.model("Order", OrderSchema)