import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    full_name: String,
    phone: String,
    address_line1: String,
    address_line2: String,
    city: String,
    state: String,
    country: String,
    postal_code: String
  },{ timestamps: true });

  
export default mongoose.model("Address", AddressSchema)