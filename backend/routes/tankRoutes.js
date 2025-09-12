import express from "express";
import Tank from "../models/Tank.js";

const router = express.Router();

// Get all tanks
router.get("/tanks", async (req, res) => {
  try {
    const tanks = await Tank.find();
    res.json(tanks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get KPIs
router.get("/kpis", async (req, res) => {
  try {
    const tanks = await Tank.find();

    const totalWaterStored = tanks.reduce((sum, t) => sum + t.currentLevel, 0);
    const totalCapacity = tanks.reduce((sum, t) => sum + t.capacity, 0);

    const kpis = {
      totalWaterStored,
      totalCapacity,
      utilizationPercentage: totalCapacity ? (totalWaterStored / totalCapacity) * 100 : 0,
      communityTanks: tanks.length,
      avgDailyConsumption: 500,
      nextRefillETA: 2,
      criticalTankCount: tanks.filter((t) => t.currentLevel < t.capacity * 0.1).length,
      lowTankCount: tanks.filter((t) => t.currentLevel < t.capacity * 0.3).length,
    };

    res.json(kpis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Monthly usage (aggregated, simple estimation per month)
router.get("/monthly-usage", async (req, res) => {
  try {
    // Basic estimate: sum current levels as baseline and vary with a wave for 12 months
    const tanks = await Tank.find();
    const baseline = tanks.reduce((sum, t) => sum + (t.currentLevel || 0), 0) || 10000;
    const now = new Date();
    const months = Array.from({ length: 12 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const label = d.toLocaleString(undefined, { month: "short" });
      const usage = Math.max(100, Math.round(baseline / 50 + 800 * Math.sin(i / 2)));
      return { month: label, usage };
    });
    res.json(months);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
