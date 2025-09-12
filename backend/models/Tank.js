// models/Tank.js
import mongoose from "mongoose";

const tankSchema = new mongoose.Schema({
  name: String,
  capacity: Number,
  currentLevel: Number,
  location: String,
});

const Tank = mongoose.model("Tank", tankSchema);
export default Tank;
