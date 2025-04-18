import Cart from "../../models/cart.model.js";

// Create a new cart item
export const createCartItem = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    const newCartItem = new Cart({ user_id, product_id, quantity });
    await newCartItem.save();
    res.status(201).json(newCartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all cart items for a user
export const getCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await Cart.find({ user_id: userId }).populate('product_id');
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update quantity of a cart item
export const updateCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const updatedCartItem = await Cart.findByIdAndUpdate(cartItemId, { quantity }, { new: true });
    res.status(200).json(updatedCartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a cart item
export const deleteCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    await Cart.findByIdAndDelete(cartItemId);
    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

