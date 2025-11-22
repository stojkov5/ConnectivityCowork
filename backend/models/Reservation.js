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
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);
