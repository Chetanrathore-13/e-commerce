import Discount from "../../models/discount.model.js";
export const createDiscount = async (req, res) => {
    try {
        const discount = await Discount.create(req.body);
        res.status(201).json(discount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.find().sort({ createdAt: -1 });
        res.status(200).json(discounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getDiscount = async (req, res) => {
    try {
        const discount = await Discount.findById(req.params.id);
        if (!discount) return res.status(404).json({ message: 'Discount code not found' });
        res.status(200).json(discount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateDiscount = async (req, res) => {
    try {
        const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!discount) return res.status(404).json({ message: 'Discount code not found' });
        res.status(200).json(discount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteDiscount = async (req, res) => {
    try {
        const discount = await Discount.findByIdAndDelete(req.params.id);
        if (!discount) return res.status(404).json({ message: 'Discount code not found' });
        res.status(200).json({ message: 'Discount code deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
