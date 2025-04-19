import Product from "../../models/product.model.js";
import Variation from "../../models/variation.model.js";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const {name,description,brand_id,category_id,material,tags} = req.body;
    if(!name || !description || !brand_id || !category_id || !material || !tags){
      return res.status(400).json({ message: "All fields are required" });
    }
    const newProduct = new Product( {
      name,
      description,
      brand_id,
      category_id,
      material,
      tags,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Populate the variations field with the actual Variation documents
    await product.populate("variations");
    // Populate the brand and category fields with the actual Brand and Category documents
    await product.populate("brand_id");
    await product.populate("category_id");
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addVariation = async (req, res) => {
  try {
    console.log("req.body",req.files)
    const {id} = req.params;
    const {size,color,price,salePrice,sku,quantity} = req.body;
    if(!size || !color || !price || !sku || !quantity){
      return res.status(400).json({ message: "All fields are required" });
    }
    // we have to image and gallery as well 
    if(!id){
      return res.status(400).json({ message: "Product id is required" });
    }
    //check for images 
    const imagepath = req.files.image[0].path;
    const gallerypaths = req.files.gallery.map((file) => file.path);
    // i have to just save the image path in the database
    // but i have to upload the image to the server as well
    const newVariation = new Variation({
      size,
      color,
      price,
      salePrice,
      sku,
      quantity,
      image: imagepath,
      gallery: gallerypaths,
    });
    const savedVariation = await newVariation.save();
    // now i have to add vairation object id to the product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.variations.push(savedVariation._id);
    await product.save();
    res.status(201).json(savedVariation);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
