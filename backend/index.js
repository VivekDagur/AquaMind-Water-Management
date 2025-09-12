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

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json()); // must come before routes

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Server is working! 🚀");
});

// ✅ Function to start server after DB connection
async function startServer() {
  try {
    await connectDB(); // connect to MongoDB first
    console.log("✅ MongoDB connected, starting server...");

    // ✅ Routes (after DB connection) mounted at unified /api
    app.use("/api", chatRoutes);
    app.use("/api", tankRoutes);
    app.use("/api", aiRoutes);

        app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: "Something went wrong!" });
    });

    // ✅ Start server
    app.listen(PORT, () => {
      console.log(`🟢 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server due to DB error:", err);
    process.exit(1); // exit process if DB connection fails
  }
}

// ✅ Start everything
startServer();
