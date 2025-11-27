// backend/routes/plans.js
import express from "express";
import Plan from "../models/Plan.js";
import { verifyToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/plans
 * Public – used by frontend Plans.jsx
 */
router.get("/", async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: 1 });
    res.json({ plans });
  } catch (err) {
    console.error("GET /api/plans error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /api/plans/:key
 * Admin only – update price
 * Body: { price: "700 MKD / per day" }
 */
router.put("/:key", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    const { price } = req.body;

    if (!price || typeof price !== "string") {
      return res
        .status(400)
        .json({ message: "Price is required as a string" });
    }

    const plan = await Plan.findOneAndUpdate(
      { key },
      { price },
      { new: true }
    );

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json({ message: "Plan updated", plan });
  } catch (err) {
    console.error("PUT /api/plans/:key error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/plans/seed
 * Admin only – one-time helper to create the 4 default plans.
 * You can leave it; it refuses to re-seed if data exists.
 */
router.post("/seed", verifyToken, requireAdmin, async (req, res) => {
  try {
    const count = await Plan.countDocuments();
    if (count > 0) {
      return res
        .status(400)
        .json({ message: "Plans collection already has data" });
    }

    const seedData = [
      {
        key: "daily",
        title: "DAILY ACCESS",
        price: "600 MKD / per day",
        color: "#ff8c00",
      },
      {
        key: "weekly",
        title: "WEEKLY ACCESS",
        price: "3500 MKD / per week",
        color: "#ffb84d",
      },
      {
        key: "monthly",
        title: "MONTHLY ACCESS",
        price: "11000 MKD / per month",
        color: "#ff8c00",
      },
      {
        key: "meeting",
        title: "MEETING ROOM",
        price: "3000 MKD / 4h • 6000 MKD / 8h",
        color: "#ff8c00",
      },
    ];

    const created = await Plan.insertMany(seedData);
    res.status(201).json({ message: "Plans seeded", plans: created });
  } catch (err) {
    console.error("POST /api/plans/seed error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
