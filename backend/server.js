// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import reservationsRoutes from "./routes/reservations.js";
import adminRoutes from "./routes/admin.js";
import plansRoutes from "./routes/plans.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

/**
 * MongoDB connection with caching for serverless (Vercel).
 *
 * On Vercel each request may run in a fresh invocation. Without caching we'd
 * open a brand-new connection every time and quickly exhaust the Atlas
 * connection pool. We memoize the connection promise on `global` so warm
 * invocations reuse the same connection.
 */
let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((m) => {
      console.log("Connected to MongoDB");
      return m;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Make sure the database is connected before any route runs.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    res.status(500).json({ message: "Database connection error" });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/plans", plansRoutes);

app.get("/", (req, res) => res.send("API is running..."));

// Local development only. On Vercel the app is exported as a serverless
// function (VERCEL=1 is set automatically there), so we must NOT call listen().
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

export default app;
