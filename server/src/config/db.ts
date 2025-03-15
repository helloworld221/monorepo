import dotenv from "dotenv";
import mongoose from "mongoose";
import { env } from "./env";

dotenv.config();

const MONGO_URI = env.MONGO_URI || "mongodb://localhost:27017/media-upload-app";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
