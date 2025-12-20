import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    const { adminToken } = req.cookies;
    if (!adminToken) return res.json({ success: false, message: "Not Authorized" });

    try {
        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') return res.json({ success: false, message: "Not Authorized" });
        req.adminId = decoded.id;
        next();
    } catch (error) {
        res.json({ success: false, message: "Session Expired" });
    }
};

export default adminAuth;