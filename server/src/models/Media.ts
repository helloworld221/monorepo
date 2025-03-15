import mongoose, { Document, Schema } from "mongoose";

export interface MediaDocument extends Document {
  userId: mongoose.Types.ObjectId;
  filename: string;
  originalname: string;
  fileType: string;
  s3Key: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<MediaDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    filename: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    size: {
      type: Number,
      required: false,
    },
    originalname: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    fileType: {
      type: String,
      required: true,
      enum: ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/webm"],
    },
    s3Key: {
      type: String,
      required: true,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model<MediaDocument>("Media", MediaSchema);
