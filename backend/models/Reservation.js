// backend/models/Reservation.js
import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    // who made the reservation
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    // "kiselavoda" or "centar"
    location: {
      type: String,
      enum: ["kiselavoda", "centar"],
      required: true,
    },

    // for centar: "centar" or "centar2"; for kisela voda: "kiselavoda"
    officeId: {
      type: String,
      required: true,
    },

    // "room" or "seat"
    resourceType: {
      type: String,
      enum: ["room", "seat"],
      required: true,
    },

    // e.g. "room-1", "seat-3"
    resourceId: {
      type: String,
      required: true,
    },

    resourceName: {
      type: String,
    },

    // "daily", "weekly", "monthly"
    plan: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    companyName: {
      type: String,
      default: "",
    },

    /**
     * reservation status flow:
     * 1) pending            -> created, user must confirm from email
     * 2) awaiting_approval  -> user confirmed, admin must approve
     * 3) confirmed          -> approved by admin, now shows in calendar
     */
    status: {
      type: String,
      enum: [
        "pending",
        "awaiting_approval",
        "confirmed",
        "cancelled",
        "rejected",
      ],
      default: "pending",
    },

    // email confirmation token (one token per batch)
    confirmationToken: {
      type: String,
    },
    confirmationTokenExpires: {
      type: Date,
    },

    // ✅ NEW: groups the whole batch for admin actions (approve/reject all seats/rooms together)
    groupId: {
      type: String,
    },

    // metadata (optional, doesn’t break anything)
    userConfirmedAt: { type: Date },
    approvedAt: { type: Date },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rejectedAt: { type: Date },
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);
