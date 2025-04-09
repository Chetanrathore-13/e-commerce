import mongoose from "mongoose";

const ProductImageSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    image_url: String
  },{ timestamps: true });

  
export default mongoose.model("ProductImage",ProductImageSchema)