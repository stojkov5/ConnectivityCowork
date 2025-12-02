// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Admin flag
    isAdmin: { type: Boolean, default: false },

    // Email verification
    isVerified: { type: Boolean, default: false },
    emailVerifyToken: { type: String },
    emailVerifyTokenExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
