import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addVariation,
} from "../controllers/product/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

import express from "express";

const router = express.Router();

// Create a new product
router.post("/createProduct", createProduct);

// Get all products
router.get("/getAllProducts", getAllProducts);

// Get a product by ID
router.get("/getProductbyId/:id", getProductById);

// Update a product by ID
router.put("/updateProduct/:id", updateProduct);

// Delete a product by ID
router.delete("/deleteProduct/:id", deleteProduct);

// Add a variation to a product
router.post(
    "/addVariation/:id",
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "gallery", maxCount: 10 },
    ]),
    addVariation
  );

export default router;
