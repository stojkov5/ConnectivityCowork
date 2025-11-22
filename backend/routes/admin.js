import express from "express";
import User from "../models/User.js";
import { verifyToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// All routes here are admin-only
router.use(verifyToken, requireAdmin);

// GET /api/admin/users  -> list all users (no passwords)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (err) {
    console.error("GET /api/admin/users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
