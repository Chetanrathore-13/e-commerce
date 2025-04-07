import Admin from "../../models/admin.model.js";
import jwt from "jsonwebtoken";


const generateaccessandrefreshtoken = (user) => {
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "20m",
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    return { accessToken, refreshToken };
};

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordCorrect = await admin.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const { accessToken, refreshToken } = generateaccessandrefreshtoken(admin);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 20 * 60 * 1000,
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })
        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
        }
}


 