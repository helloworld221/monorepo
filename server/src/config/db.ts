import dotenv from "dotenv";
import mongoose from "mongoose";
import { env } from "./env";

dotenv.config();

const MONGODB_URI = env.MONGODB_URI || "mongodb://localhost:27017/web-gallery";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
