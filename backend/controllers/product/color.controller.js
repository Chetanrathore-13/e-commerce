import Color from "../../models/color.model.js";

// Create a new color
export const createColor = async (req, res) => {
  try {
    const { name, hex_code } = req.body;
    const color = new Color({ name, hex_code });
    await color.save();
    res.status(201).json(color);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all colors
export const getColors = async (req, res) => {
  try {
    const colors = await Color.find();
    res.status(200).json(colors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a color by ID
export const getColorById = async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color) return res.status(404).json({ error: "Color not found" });
    res.status(200).json(color);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a color by ID
export const updateColor = async (req, res) => {
  try {
    const { name, hex_code } = req.body;
    const color = await Color.findByIdAndUpdate(
      req.params.id,
      { name, hex_code },
      { new: true }
    );
    if (!color) return res.status(404).json({ error: "Color not found" });
    res.status(200).json(color);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a color by ID
export const deleteColor = async (req, res) => {
  try {
    const color = await Color.findByIdAndDelete(req.params.id);
    if (!color) return res.status(404).json({ error: "Color not found" });
    res.status(200).json({ message: "Color deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

