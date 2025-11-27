// backend/models/Plan.js
import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true, // "daily", "weekly", "monthly", "meeting"
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true, // e.g. "600 MKD / per day"
    },
    color: {
      type: String,
      default: "#ff8c00",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
