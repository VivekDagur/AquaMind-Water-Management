// db.js
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      // 🔹 Try connecting to Atlas / real MongoDB
      await mongoose.connect(process.env.MONGO_URI, {
        // modern mongoose drivers don’t need these options
      });
      console.log("✅ Connected to MongoDB Atlas");
    } else {
      // 🔹 Fallback to in-memory MongoDB
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log("✅ Connected to in-memory MongoDB (mock)");
    }
  } catch (err) {
    console.error("❌ DB Connection Error:", err);

    // 🔹 If Atlas fails, fallback to in-memory MongoDB
    try {
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log("⚠️ Fallback: Connected to in-memory MongoDB");
    } catch (fallbackErr) {
      console.error("❌ In-memory MongoDB also failed:", fallbackErr);
    }
  }
};
