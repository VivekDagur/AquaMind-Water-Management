// index.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config(); // ✅ load .env first

import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";   
import chatRoutes from "./routes/chatRoutes.js";
import tankRoutes from "./routes/tankRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json()); // must come before routes

// ✅ Health check route
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: "healthy", 
    message: "AquaMind Server is running! 🚀",
    timestamp: new Date().toISOString()
  });
});

// ✅ Health check route for Railway
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ✅ Mount routes first (before DB connection)
app.use("/api", authRoutes);
app.use("/api", chatRoutes);
app.use("/api", tankRoutes);
app.use("/api", aiRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ✅ Function to start server
async function startServer() {
  try {
    // Connect to DB in background (don't block server start)
    connectDB().then(() => {
      console.log("✅ MongoDB connected");
    }).catch((err) => {
      console.log("⚠️ MongoDB connection failed, using fallback:", err.message);
    });

    // ✅ Start server immediately
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🟢 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

// ✅ Start everything
startServer();
