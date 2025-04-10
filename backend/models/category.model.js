import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: { type: String, unique: true },
    parent_category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }
  },{ timestamps: true });


export default mongoose.model("Category", CategorySchema)