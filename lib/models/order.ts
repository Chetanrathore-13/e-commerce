import mongoose, { Schema, type Document } from "mongoose"

export interface OrderItem {
  product_id: mongoose.Types.ObjectId
  variation_id: mongoose.Types.ObjectId
  quantity: number
  price: number
  name: string
  image: string
  size: string
  color: string
}

export interface Address {
  full_name: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone: string
}

export interface IOrder extends Document {
  user_id: mongoose.Types.ObjectId
  order_number: string
  items: OrderItem[]
  total: number
  subtotal: number
  discount: number
  coupon_code?: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned" | "return_requested"
  payment_method: "credit-card" | "paypal" | "bank-transfer" | "cod"
  payment_status: "pending" | "processing" | "completed" | "failed" | "refunded"
  shipping_address: Address
  billing_address: Address
  tracking_number?: string
  notes?: string
  cancel_reason?: string
  return_reason?: string
  additionalComments?: string
  return_items?: string[]
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order_number: { type: String, required: true, unique: true },
    items: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        variation_id: { type: mongoose.Schema.Types.ObjectId, ref: "Variation", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        size: { type: String, required: true },
        color: { type: String, required: true },
      },
    ],
    total: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    coupon_code: { type: String },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled", "returned", "return_requested"],
      default: "pending",
    },
    payment_method: {
      type: String,
      enum: ["credit-card", "paypal", "bank-transfer", "cod"],
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded"],
      default: "pending",
    },
    shipping_address: {
      full_name: { type: String, required: true },
      address_line1: { type: String, required: true },
      address_line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postal_code: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    billing_address: {
      full_name: { type: String, required: true },
      address_line1: { type: String, required: true },
      address_line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postal_code: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    tracking_number: { type: String },
    notes: { type: String },
    cancel_reason: { type: String },
    return_reason: { type: String },
    additionalComments: { type: String },
    return_items: [{ type: String }],
  },
  { timestamps: true },
)

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
