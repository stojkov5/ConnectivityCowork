// backend/routes/reservations.js
import express from "express";
import crypto from "crypto";
import Reservation from "../models/Reservation.js";
import { verifyToken } from "../middleware/auth.js";
import { computeRange } from "../utils/dateRange.js";
import {
  sendReservationConfirmationEmail,
  sendOwnerReservationNotificationEmail,
} from "./utils/sendEmail.js";

const router = express.Router();

const OWNER_EMAIL = "coworkkonnectivityskopje@gmail.com";

// helper: resource display (optional)
const makeResourceName = (resourceId) => resourceId;

// GET /api/reservations
// Optional query: location, officeId
// Returns CONFIRMED reservations
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

// POST /api/reservations
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

    // check only CONFIRMED
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

    const confirmationToken = crypto.randomBytes(32).toString("hex");
    const confirmationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const docs = resourceIds.map((id) => ({
      user: req.user._id,
      email: req.user.email,
      location,
      officeId,
      resourceType,
      resourceId: id,
      resourceName: makeResourceName(id),
      plan,
      startDate: start,
      endDate: end,
      companyName: companyName || "",
      status: "pending",
      confirmationToken,
      confirmationTokenExpires,
    }));

    const created = await Reservation.insertMany(docs);

    // Send confirmation email to the USER (they must click)
    try {
      await sendReservationConfirmationEmail(
        req.user.email,
        confirmationToken,
        {
          location,
          officeName: officeId,
          plan,
          startDate: start.toISOString().slice(0, 10),
          endDate: end.toISOString().slice(0, 10),
          companyName: companyName || "",
          resources: resourceIds.map((id) => ({
            id,
            name: makeResourceName(id),
          })),
        }
      );
    } catch (e) {
      console.error("Error sending reservation confirmation email:", e);
    }

    return res.status(201).json({
      message:
        "Reservation request created. Please check your email to confirm the booking.",
      reservations: created,
    });
  } catch (err) {
    console.error("POST /api/reservations error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/reservations/confirm/:token
router.get("/confirm/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const now = new Date();

    const pending = await Reservation.find({
      confirmationToken: token,
      confirmationTokenExpires: { $gt: now },
      status: "pending",
    }).populate("user", "username email");

    if (!pending || pending.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reservation confirmation link." });
    }

    const sample = pending[0];

    // check conflicts again before confirming
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
      // remove pending batch
      await Reservation.deleteMany({
        confirmationToken: token,
        status: "pending",
      });

      return res.status(409).json({
        message:
          "Sorry, these resources have been booked by someone else in the meantime. Please try another date or resource.",
      });
    }

    // confirm batch
    await Reservation.updateMany(
      { confirmationToken: token, status: "pending" },
      {
        $set: { status: "confirmed" },
        $unset: { confirmationToken: 1, confirmationTokenExpires: 1 },
      }
    );

    // ✅ OWNER notification (best-effort)
    try {
      await sendOwnerReservationNotificationEmail(OWNER_EMAIL, {
        reserverEmail: sample.email || sample.user?.email,
        reserverUsername: sample.user?.username,
        companyName: sample.companyName,
        location: sample.location,
        officeId: sample.officeId,
        resourceType: sample.resourceType,
        plan: sample.plan,
        startDate: sample.startDate?.toISOString?.().slice(0, 10),
        endDate: sample.endDate?.toISOString?.().slice(0, 10),
        resources: pending.map((r) => ({
          id: r.resourceId,
          name: r.resourceName || r.resourceId,
        })),
        createdAt: sample.createdAt?.toISOString?.(),
      });
    } catch (e) {
      console.error("OWNER email failed:", e);
    }

    return res.json({ message: "Reservation confirmed successfully." });
  } catch (err) {
    console.error("GET /api/reservations/confirm/:token error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
