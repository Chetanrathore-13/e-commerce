import Testimonial from "../models/testimonial.model.js";

// Create testimonial
export const createTestimonial = async (req, res) => {
    const testimonial = new Testimonial(req.body);

    try {
        const newTestimonial = await testimonial.save();
        res.status(201).json(newTestimonial);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// Get all testimonials
export const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find();
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Get single testimonial
export const getTestimonialById = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        res.status(200).json(testimonial);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Update testimonial
export const updateTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(testimonial);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// Delete testimonial
export const deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndRemove(
            req.params.id
        );
        res.status(200).json({ message: "Testimonial deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
