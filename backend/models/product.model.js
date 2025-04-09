import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: String,
    discount_price: { type: String, default: null },
    stock_quantity: Number,
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    size_chart: String,
    material: String,
    color_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Color' },
    is_featured: Boolean,
    is_best_seller: Boolean,
    created_at: String,
    updated_at: String
  },{ timestamps: true });

export default mongoose.model("Product", ProductSchema)