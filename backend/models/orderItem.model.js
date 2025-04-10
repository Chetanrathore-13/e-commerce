import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price_at_purchase: Number
  },{ timestamps: true });

export default mongoose.model("OrderItem",OrderItemSchema)