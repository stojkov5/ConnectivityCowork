// backend/models/Plan.js
import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    // unique key we use in code: "daily", "weekly", "monthly", "meeting"
    key: {
      type: String,
      required: true,
      unique: true,
    },
    // display title on the card
    title: {
      type: String,
      required: true,
    },
    // price text shown to user (string so you can write "3000 MKD / 4h • 6000 MKD / 8h")
    price: {
      type: String,
      required: true,
    },
    // hex color for icon / accent
    color: {
      type: String,
      default: "#ff8c00",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
