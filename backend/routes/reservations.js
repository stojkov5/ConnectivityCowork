// backend/routes/reservations.js
import express from "express";
import Reservation from "../models/Reservation.js";
import { verifyToken } from "../middleware/auth.js";
import { computeRange } from "../utils/dateRange.js";

const router = express.Router();

// ADMIN: get all reservations
router.get("/admin/all", verifyToken, async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Admin only" });
    }

    const reservations = await Reservation.find({}).sort({ startDate: 1 });
    res.json({ reservations });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/reservations
 * Optional query:
 *  - location=kiselavoda|centar
 *  - officeId=kiselavoda|centar|centar2
 */
router.get("/", async (req, res) => {
  try {
    const { location, officeId } = req.query;
    const filter = {};

    if (location) filter.location = location;
    if (officeId) filter.officeId = officeId;

    const reservations = await Reservation.find(filter).sort("startDate");
    res.json({ reservations });
  } catch (err) {
    console.error("GET /api/reservations error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/reservations
 * Body:
 * {
 *   location: "kiselavoda" | "centar",
 *   officeId: "kiselavoda" | "centar" | "centar2",
 *   resourceType: "room" | "seat",
 *   resourceIds: ["room-1", "room-2"],
 *   plan: "daily" | "weekly" | "monthly",
 *   startDate: "2025-11-25",
 *   companyName: "My Company"
 * }
 *
 * Requires Authorization: Bearer <token>
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      location,
      officeId,
      resourceType,
      resourceIds,
      plan,
      startDate,
      companyName,
    } = req.body;

    if (
      !location ||
      !officeId ||
      !resourceType ||
      !Array.isArray(resourceIds) ||
      resourceIds.length === 0 ||
      !plan ||
      !startDate
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const { start, end } = computeRange(plan, startDate);

    // Check conflicts for all selected resources
    const conflicts = await Reservation.find({
      location,
      officeId,
      resourceType,
      resourceId: { $in: resourceIds },
      startDate: { $lte: end },
      endDate: { $gte: start },
    });

    if (conflicts.length > 0) {
      return res.status(400).json({
        message: "One or more resources are already booked in that period.",
        conflicts,
      });
    }

    // Create one reservation per resource ID
    const docs = resourceIds.map((id) => ({
      user: req.user._id,
      email: req.user.email,
      location,
      officeId,
      resourceType,
      resourceId: id,
      plan,
      startDate: start,
      endDate: end,
      companyName: companyName || "",
    }));

    const created = await Reservation.insertMany(docs);

    res.status(201).json({
      message: "Reservation(s) created",
      reservations: created,
    });
  } catch (err) {
    console.error("POST /api/reservations error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
