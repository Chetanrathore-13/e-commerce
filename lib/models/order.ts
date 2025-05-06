import mongoose, { Schema, type Document } from "mongoose"

export interface IOrderItem {
  product_id: mongoose.Types.ObjectId
  variation_id: mongoose.Types.ObjectId
  quantity: number
  price: number
  name: string
  image: string
  size: string
  color: string
}

export interface IAddress {
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
  items: IOrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shipping_address: IAddress
  billing_address: IAddress
  payment_method: string
  payment_status: "pending" | "paid" | "failed"
  tracking_number?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variation_id: { type: mongoose.Schema.Types.ObjectId, ref: "Variation", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
})

const AddressSchema = new Schema<IAddress>({
  full_name: { type: String, required: true },
  address_line1: { type: String, required: true },
  address_line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postal_code: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
})

const OrderSchema = new Schema<IOrder>(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order_number: { type: String, required: true, unique: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shipping_address: { type: AddressSchema, required: true },
    billing_address: { type: AddressSchema, required: true },
    payment_method: { type: String, required: true },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    tracking_number: { type: String },
    notes: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
