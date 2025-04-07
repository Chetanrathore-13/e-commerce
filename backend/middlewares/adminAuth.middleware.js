import jwt from 'jsonwebtoken'

const adminAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.adminId = decoded.id;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default adminAuthMiddleware