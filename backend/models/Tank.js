// models/Tank.js
import mongoose from "mongoose";

const tankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  currentLevel: { type: Number, required: true },
  location: { type: String, required: true },
  tankType: { type: String, enum: ['residential', 'commercial', 'industrial', 'community'], default: 'residential' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sensorConnected: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const Tank = mongoose.model("Tank", tankSchema);
export default Tank;
