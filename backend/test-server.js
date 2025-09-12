import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import tankRoutes from "./routes/tankRoutes.js";
// src/pages/api/monthly-usage.ts

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("✅ Server is working! No 403 here.");
});

// ✅ Chat route (context-aware)
app.post("/api/chat", (req, res) => {
  const { message, conversationId, context } = req.body;

  console.log("💬 Received message:", message);
  console.log("📊 Context:", context);

  let reply = `You asked: "${message}". `;

  // Project Summary
  if (context?.projectSummary) {
    reply += `Project summary: ${context.projectSummary}. `;
  }

  // Selected Tank info
  if (context?.selectedTank) {
    reply += `Currently monitoring tank "${context.selectedTank.name}" with ${context.selectedTank.current_liters}L stored (capacity ${context.selectedTank.capacity_liters}L). `;
  }

  // KPIs info
  if (context?.kpis) {
    reply += `Total stored water: ${context.kpis.totalWaterStored}L, utilization: ${context.kpis.utilizationPercentage}%, community tanks: ${context.kpis.communityTanks}. `;
    if (context.kpis.nextRefillETA) {
      reply += `Next refill ETA is about ${context.kpis.nextRefillETA} hours. `;
    }
    if (context.kpis.criticalTankCount > 0 || context.kpis.lowTankCount > 0) {
      reply += `⚠️ Attention: ${context.kpis.criticalTankCount} critical and ${context.kpis.lowTankCount} low tanks detected. `;
    }
  }

  // ✅ Send response
  res.json({
    reply,
    conversationId: conversationId ?? "conv-" + Date.now(),
  });
});

// ✅ Tank + KPI routes
app.use("/api", tankRoutes);

// ✅ Single Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
});
