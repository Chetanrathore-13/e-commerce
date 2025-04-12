import  ShippingPartner  from "../models/shippingPartner.model.js";

export const createShippingPartner = async (req, res) => {
    try {
        const shippingPartner = await ShippingPartner.create(req.body);
        res.status(201).json(shippingPartner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getShippingPartners = async (req, res) => {
    try {
        const shippingPartners = await ShippingPartner.find().sort({ createdAt: -1 });
        res.status(200).json(shippingPartners);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getShippingPartnerById = async (req, res) => {
    try {
        const shippingPartner = await ShippingPartner.findById(req.params.id);
        if (!shippingPartner) {
            return res.status(404).json({ message: "Shipping Partner not found" });
        }
        res.status(200).json(shippingPartner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateShippingPartner = async (req, res) => {
    try {
        const shippingPartner = await ShippingPartner.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!shippingPartner) {
            return res.status(404).json({ message: "Shipping Partner not found" });
        }
        res.status(200).json(shippingPartner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteShippingPartner = async (req, res) => {
    try {
        const shippingPartner = await ShippingPartner.findByIdAndRemove(
            req.params.id
        );
        if (!shippingPartner) {
            return res.status(404).json({ message: "Shipping Partner not found" });
        }
        res.status(200).json({ message: "Shipping Partner deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
