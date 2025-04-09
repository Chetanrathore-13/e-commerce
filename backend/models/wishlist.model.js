import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
  },{ timestamps: true });

  
export default mongoose.model("Wishlist",WishlistSchema )