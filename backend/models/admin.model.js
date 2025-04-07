import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshtoken: {
        type: String,
    },
}, { timestamps: true });

// isPasswordCorrect method
adminSchema.methods.isPasswordCorrect = async function (password) {
    return  password === this.password;
};

export default mongoose.model("Admin", adminSchema);