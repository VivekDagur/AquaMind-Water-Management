import express from "express";
import Tank from "../models/Tank.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Get all tanks for authenticated user
router.get("/tanks", authenticateToken, async (req, res) => {
  try {
    const tanks = await Tank.find({ userId: req.user.userId });
    res.json(tanks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new tank
router.post("/tanks", authenticateToken, async (req, res) => {
  try {
    const { name, capacity, currentLevel, location, tankType } = req.body;
    
    const tank = new Tank({
      name,
      capacity: parseFloat(capacity),
      currentLevel: parseFloat(currentLevel),
      location,
      tankType,
      userId: req.user.userId
    });
    
    await tank.save();
    res.status(201).json(tank);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update tank level
router.put("/tanks/:id", authenticateToken, async (req, res) => {
  try {
    const { currentLevel } = req.body;
    const tank = await Tank.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { currentLevel: parseFloat(currentLevel), lastUpdated: new Date() },
      { new: true }
    );
    
    if (!tank) {
      return res.status(404).json({ error: 'Tank not found' });
    }
    
    res.json(tank);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get KPIs for authenticated user
router.get("/kpis", authenticateToken, async (req, res) => {
  try {
    const tanks = await Tank.find({ userId: req.user.userId });

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

// Get alerts for authenticated user
router.get("/alerts", authenticateToken, async (req, res) => {
  try {
    const tanks = await Tank.find({ userId: req.user.userId });
    const alerts = [];
    
    tanks.forEach(tank => {
      const percentage = (tank.currentLevel / tank.capacity) * 100;
      
      if (percentage <= 10) {
        alerts.push({
          id: `critical-${tank._id}`,
          type: 'critical',
          title: 'Critical Water Level',
          message: `Tank "${tank.name}" is critically low (${percentage.toFixed(1)}%)`,
          tankId: tank._id,
          tankName: tank.name,
          timestamp: new Date(),
          severity: 'high'
        });
      } else if (percentage <= 30) {
        alerts.push({
          id: `warning-${tank._id}`,
          type: 'warning',
          title: 'Low Water Level',
          message: `Tank "${tank.name}" is running low (${percentage.toFixed(1)}%)`,
          tankId: tank._id,
          tankName: tank.name,
          timestamp: new Date(),
          severity: 'medium'
        });
      }
      
      // Check for sensor connectivity (if applicable)
      if (tank.sensorConnected === false) {
        alerts.push({
          id: `sensor-${tank._id}`,
          type: 'info',
          title: 'Sensor Disconnected',
          message: `Tank "${tank.name}" sensor is not connected`,
          tankId: tank._id,
          tankName: tank.name,
          timestamp: new Date(),
          severity: 'low'
        });
      }
    });
    
    // Sort by severity and timestamp
    const severityOrder = { high: 3, medium: 2, low: 1 };
    alerts.sort((a, b) => {
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[b.severity] - severityOrder[a.severity];
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Monthly usage (aggregated, simple estimation per month)
router.get("/monthly-usage", authenticateToken, async (req, res) => {
  try {
    const tanks = await Tank.find({ userId: req.user.userId });
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

// Get reports data
router.get("/reports", authenticateToken, async (req, res) => {
  try {
    const tanks = await Tank.find({ userId: req.user.userId });
    const now = new Date();
    
    // Generate weekly consumption data
    const weeklyData = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - i));
      const baseConsumption = tanks.reduce((sum, t) => sum + (t.capacity * 0.1), 0);
      const consumption = Math.max(50, Math.round(baseConsumption + Math.random() * 200));
      
      return {
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        consumption
      };
    });
    
    // Generate efficiency metrics
    const totalCapacity = tanks.reduce((sum, t) => sum + t.capacity, 0);
    const totalCurrent = tanks.reduce((sum, t) => sum + t.currentLevel, 0);
    const efficiency = totalCapacity > 0 ? (totalCurrent / totalCapacity) * 100 : 0;
    
    // Tank performance data
    const tankPerformance = tanks.map(tank => {
      const percentage = (tank.currentLevel / tank.capacity) * 100;
      const status = percentage > 70 ? 'excellent' : percentage > 30 ? 'good' : percentage > 10 ? 'warning' : 'critical';
      
      return {
        id: tank._id,
        name: tank.name,
        capacity: tank.capacity,
        currentLevel: tank.currentLevel,
        percentage: percentage.toFixed(1),
        status,
        location: tank.location,
        lastUpdated: tank.lastUpdated || tank.createdAt
      };
    });
    
    const reports = {
      summary: {
        totalTanks: tanks.length,
        totalCapacity,
        totalCurrent,
        efficiency: efficiency.toFixed(1),
        averageLevel: tanks.length > 0 ? (totalCurrent / tanks.length).toFixed(0) : 0
      },
      weeklyConsumption: weeklyData,
      tankPerformance,
      alerts: {
        critical: tanks.filter(t => (t.currentLevel / t.capacity) <= 0.1).length,
        warning: tanks.filter(t => (t.currentLevel / t.capacity) <= 0.3 && (t.currentLevel / t.capacity) > 0.1).length,
        normal: tanks.filter(t => (t.currentLevel / t.capacity) > 0.3).length
      }
    };
    
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
