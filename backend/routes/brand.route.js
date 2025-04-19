import {createBrand, getBrands, getBrandById, updateBrand, deleteBrand} from "../controllers/product/brand.controller.js";

import express from "express";



const router = express.Router();

// Create a new brand
router.post("/createBrand", createBrand);

// Get all brands
router.get("/getBrands", getBrands);

// Get a brand by ID
router.get("/getBrandbyId/:id", getBrandById);

// Update a brand by ID
router.put("/updateBrand/:id", updateBrand);

// Delete a brand by ID
router.delete("/deleteBrand/:id", deleteBrand);

export default router;