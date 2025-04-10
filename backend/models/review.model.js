import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    created_at: String
  },{ timestamps: true });

  