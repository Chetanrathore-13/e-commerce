import OrderItem from "../../models/orderItem.model.js";

// Create a new order item
export const createOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.create(req.body);
    res.status(201).json(orderItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get an order item by ID
export const getOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.findById(req.params.id);
    if (!orderItem) return res.status(404).json({ message: 'Order item not found' });
    res.status(200).json(orderItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an order item by ID
export const updateOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!orderItem) return res.status(404).json({ message: 'Order item not found' });
    res.status(200).json(orderItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an order item by ID
export const deleteOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByIdAndDelete(req.params.id);
    if (!orderItem) return res.status(404).json({ message: 'Order item not found' });
    res.status(200).json({ message: 'Order item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

