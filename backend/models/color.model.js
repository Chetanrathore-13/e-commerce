import mongoose from "mongoose"

const ColorSchema = new mongoose.Schema({
    name: String,
    hex_code: String
  },{timestamps:true});

  
export default mongoose.model("Color", ColorSchema)