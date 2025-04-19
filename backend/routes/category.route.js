import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/product/category.controller.js";
import express from "express";

const router = express.Router();

// Create a new category
router.post("/createCategory", createCategory);

// Get all categories
router.get("/getCategories", getCategories);

// Get a category by ID
router.get("/getCategorybyId/:id", getCategoryById);

// Update a category by ID
router.put("/updateCategory/:id", updateCategory);

// Delete a category by ID
router.delete("/deleteCategory/:id", deleteCategory);

export default router;
