import Wishlist from "../../models/Wishlist.js";
export const createWishlist = async (req, res) => {
    try {
        const newWishlist = new Wishlist(req.body);
        const savedWishlist = await newWishlist.save();
        res.status(200).json(savedWishlist);
    } catch (err) {
        res.status(500).json(err);
    }
}

export const getWishlists = async (req, res) => {
    try {
        const wishlists = await Wishlist.find();
        res.status(200).json(wishlists);
    } catch (err) {
        res.status(500).json(err);
    }
}

export const getWishlistById = async (req, res) => {
    try {
        const wishlist = await Wishlist.findById(req.params.id);
        res.status(200).json(wishlist);
    } catch (err) {
        res.status(500).json(err);
    }
}

export const updateWishlist = async (req, res) => {
    try {
        const updatedWishlist = await Wishlist.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedWishlist);
    } catch (err) {
        res.status(500).json(err);
    }
}

export const deleteWishlist = async (req, res) => {
    try {
        await Wishlist.findByIdAndDelete(req.params.id);
        res.status(200).json("Wishlist deleted successfully");
    } catch (err) {
        res.status(500).json(err);
    }
}
