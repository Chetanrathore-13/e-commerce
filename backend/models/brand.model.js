import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
    name: String
  },{ timestamps: true });

  
export default mongoose.model("Brand", BrandSchema)