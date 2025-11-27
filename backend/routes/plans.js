// backend/routes/plans.js
import express from "express";
import Plan from "../models/Plan.js";
import { verifyToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * PUBLIC: Get all plans (for landing page)
 * GET /api/plans
 */
router.get("/", async (req, res) => {
  try {
    const plans = await Plan.find().sort({ order: 1 });
    res.json({ plans });
  } catch (err) {
    console.error("GET /api/plans error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ADMIN: Update a plan's price (and optionally title/color)
 * PUT /api/plans/:key
 * body: { price, title?, color? }
 */
router.put("/:key", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    const { price, title, color } = req.body;

    if (!price) {
      return res.status(400).json({ message: "Price is required" });
    }

    const update = { price };
    if (title) update.title = title;
    if (color) update.color = color;

    const plan = await Plan.findOneAndUpdate({ key }, update, {
      new: true,
    });

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
 * (OPTIONAL) ADMIN: Seed default plans
 * Call ONCE from Postman if collection is empty.
 */
router.post("/seed", verifyToken, requireAdmin, async (req, res) => {
  try {
    const count = await Plan.countDocuments();
    if (count > 0) {
      return res
        .status(400)
        .json({ message: "Plans already exist, seed skipped" });
    }

    const defaults = [
      {
        key: "daily",
        title: "DAILY ACCESS",
        price: "600 MKD / per day",
        color: "#ff8c00",
        order: 1,
      },
      {
        key: "weekly",
        title: "WEEKLY ACCESS",
        price: "3500 MKD / per week",
        color: "#ffb84d",
        order: 2,
      },
      {
        key: "monthly",
        title: "MONTHLY ACCESS",
        price: "11000 MKD / per month",
        color: "#ff8c00",
        order: 3,
      },
      {
        key: "meeting",
        title: "MEETING ROOM",
        price: "3000 MKD / 4h • 6000 MKD / 8h",
        color: "#ff8c00",
        order: 4,
      },
    ];

    const created = await Plan.insertMany(defaults);
    res.json({ message: "Plans seeded", plans: created });
  } catch (err) {
    console.error("POST /api/plans/seed error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
