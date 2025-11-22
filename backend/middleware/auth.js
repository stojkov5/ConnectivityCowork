// backend/middleware/auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Invalid token user" });

    req.user = user;
    next();
  } catch (err) {
    console.error("verifyToken error:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
