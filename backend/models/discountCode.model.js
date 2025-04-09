import mongoose from "mongoose";

const DiscountCodeSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    discount_percentage: Number,
    valid_from: Date,
    valid_to: Date,
    status: Boolean
  },{ timestamps: true });

export default mongoose.model("DiscountCode", DiscountCodeSchema)