import mongoose, { Document, Schema } from "mongoose";

export interface UserDocument extends Document {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    picture: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<UserDocument>("User", UserSchema);
