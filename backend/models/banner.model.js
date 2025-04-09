import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
    image_url: String,
    link_url: String,
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  },{ timestamps: true });

  
export default mongoose.model("Banner", BannerSchema)