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
  subscriptions: {
    facebook: [
      {
        page: {
          id: number;
          name: string;
        };
        startDate: Date;
        endDate: Date;
        status: "pending" | "running" | "expired";
        isPaid: Boolean;
        payment: {
          method: String;
          trxId: String;
          amount: Number;
          paidAt: Date;
        };
      },
    ];
    instagram: [
      {
        user: {
          id: number;
          username: string;
        };
        startDate: Date;
        endDate: Date;
        status: "pending" | "running" | "expired";
        isPaid: Boolean;
        payment: {
          method: String;
          trxId: String;
          amount: Number;
          paidAt: Date;
        };
      },
    ];
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
        page: {
          id: { type: String },
          name: { type: String },
        },
      },
      instagram: {
        startDate: { type: Date },
        endDate: { type: Date },
      },
    },
    subscriptions: {
      facebook: [
        {
          page: {
            id: { type: Number },
            name: { type: String },
          },
          startDate: { type: Date },
          endDate: { type: Date },
          status: {
            type: String,
            enum: ["pending", "running", "expired"],
            default: "pending",
          },
          isPaid: { type: Boolean, default: false },
          payment: {
            method: { type: String },
            trxId: { type: String },
            amount: { type: Number },
            paidAt: { type: Date },
          },
        },
      ],
      instagram: [
        {
          user: {
            id: { type: Number },
            username: { type: String },
          },
          startDate: { type: Date },
          endDate: { type: Date },
          status: {
            type: String,
            enum: ["pending", "running", "expired"],
            default: "pending",
          },
          isPaid: { type: Boolean, default: false },
          payment: {
            method: { type: String },
            trxId: { type: String },
            amount: { type: Number },
            paidAt: { type: Date },
          },
        },
      ],
    },
  },
  { timestamps: true },
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
