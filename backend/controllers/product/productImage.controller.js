import { ProductImage } from "../models/ProductImage.model.js";

// Create
export const createProductImage = async (req, res) => {
  try {
    const newProductImage = new ProductImage(req.body);
    const savedProductImage = await newProductImage.save();
    res.status(200).json(savedProductImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read
export const getAllProductImages = async (req, res) => {
  try {
    const productImages = await ProductImage.find();
    res.status(200).json(productImages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductImageById = async (req, res) => {
  try {
    const productImage = await ProductImage.findById(req.params.id);
    res.status(200).json(productImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
export const updateProductImage = async (req, res) => {
  try {
    const updatedProductImage = await ProductImage.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProductImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete
export const deleteProductImage = async (req, res) => {
  try {
    await ProductImage.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Product image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

