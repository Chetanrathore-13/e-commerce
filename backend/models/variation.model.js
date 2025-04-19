import mongoose from "mongoose";

const VariationSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
      enum: ["XS", "S", "M", "L", "XL", "XXL"], // extend as needed
    },
    color: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
    },
    image: {
      type: String, // main image URL
    },
    gallery: [String], // array of image URLs
    sku: {
      type: String,
      unique: true,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Variation", VariationSchema);
