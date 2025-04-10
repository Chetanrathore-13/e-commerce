import mongoose from "mongoose";

const ShippingPartnerSchema = new mongoose.Schema({
    name: String,
    tracking_url_format: String
  },{ timestamps: true });

export default mongoose.model("ShippingPartner", ShippingPartnerSchema)