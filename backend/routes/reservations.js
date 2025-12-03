// backend/routes/reservations.js
import express from "express";
import crypto from "crypto";
import Reservation from "../models/Reservation.js";
import { verifyToken } from "../middleware/auth.js";
import { computeRange } from "../utils/dateRange.js";
import { sendReservationConfirmationEmail } from "../utils/sendEmail.js";

const router = express.Router();

// ========== ADMIN: get all reservations (any status) ==========
router.get("/admin/all", verifyToken, async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Admin only" });
    }

    const reservations = await Reservation.find({})
      .sort({ startDate: 1 })
      .populate("user", "username email");

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
 * Only returns CONFIRMED reservations (used by booking UI).
 */
router.get("/", async (req, res) => {
  try {
    const { location, officeId } = req.query;
    const filter = { status: "confirmed" };

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
 *
 * Creates PENDING reservations and sends confirmation email.
 * Real blocking is only when user clicks the email link.
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

    // Only check against CONFIRMED reservations
    const conflicts = await Reservation.find({
      location,
      officeId,
      resourceType,
      resourceId: { $in: resourceIds },
      status: "confirmed",
      startDate: { $lte: end },
      endDate: { $gte: start },
    });

    if (conflicts.length > 0) {
      return res.status(400).json({
        message: "One or more resources are already booked in that period.",
        conflicts,
      });
    }

    // One token per batch
    const confirmationToken = crypto.randomBytes(32).toString("hex");
    const confirmationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

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
      status: "pending",
      confirmationToken,
      confirmationTokenExpires,
    }));

    const created = await Reservation.insertMany(docs);

    // Send confirmation email
    try {
      await sendReservationConfirmationEmail(req.user.email, confirmationToken, {
        location,
        officeName: officeId, // you can improve this with real names if you want
        plan,
        startDate: start.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10),
        companyName,
        resources: resourceIds.map((id) => ({ id, name: id })),
      });
    } catch (e) {
      console.error("Error sending reservation confirmation email:", e);
    }

    res.status(201).json({
      message:
        "Reservation request created. Please check your email to confirm the booking.",
      reservations: created,
    });
  } catch (err) {
    console.error("POST /api/reservations error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET /api/reservations/confirm/:token
 * User clicks email link -> we confirm all pending reservations with that token.
 */
router.get("/confirm/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const now = new Date();

    const pending = await Reservation.find({
      confirmationToken: token,
      confirmationTokenExpires: { $gt: now },
      status: "pending",
    });

    if (!pending || pending.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reservation confirmation link." });
    }

    // Use first doc to get common values
    const sample = pending[0];

    // Double-check conflicts against CONFIRMED reservations
    const conflicts = await Reservation.find({
      location: sample.location,
      officeId: sample.officeId,
      resourceType: sample.resourceType,
      resourceId: { $in: pending.map((r) => r.resourceId) },
      status: "confirmed",
      startDate: { $lte: sample.endDate },
      endDate: { $gte: sample.startDate },
    });

    if (conflicts.length > 0) {
      // Optionally delete pending ones
      await Reservation.deleteMany({ confirmationToken: token, status: "pending" });

      return res.status(409).json({
        message:
          "Sorry, these resources have been booked by someone else in the meantime. Please try another date or resource.",
      });
    }

    // Confirm them
    await Reservation.updateMany(
      { confirmationToken: token, status: "pending" },
      {
        $set: { status: "confirmed" },
        $unset: { confirmationToken: 1, confirmationTokenExpires: 1 },
      }
    );

    return res.json({
      message: "Reservation confirmed successfully.",
    });
  } catch (err) {
    console.error("GET /api/reservations/confirm/:token error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
