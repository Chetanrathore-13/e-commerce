import mongoose from "mongoose";
import slugify from "slugify";

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    material: String,
    tags: [String],
    is_featured: { type: Boolean, default: false },
    is_best_seller: { type: Boolean, default: false },
    variations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Variation' }],
    slug: { type: String, unique: true },
  },{ timestamps: true });
  

  ProductSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });

export default mongoose.model("Product", ProductSchema)