// /lib/models/User.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
  imageUrl?: string;
  authProvider: "email" | "google" | "facebook";
  isFreeTrial: {
    facebook: { startDate: Date; endDate: Date };
    instagram: { startDate: Date; endDate: Date };
  };
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imageUrl: { type: String },
    authProvider: {
      type: String,
      enum: ["email", "google", "facebook"],
      default: "email",
    },
    isFreeTrial: {
      facebook: {
        startDate: { type: Date },
        endDate: { type: Date },
      },
      instagram: {
        startDate: { type: Date },
        endDate: { type: Date },
      },
    },
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
