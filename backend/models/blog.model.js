import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    title: String,
    content: String,
    image_url: String,
    created_at: String,
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  },{ timestamps: true });

export default mongoose.model("Blog",BlogSchema)