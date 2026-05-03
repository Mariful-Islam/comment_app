// /lib/models/User.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
  imageUrl?: string;
  authProvider: "email" | "google" | "facebook";
  isFreeTrial: {
    facebook: { 
      startDate: Date; 
      endDate: Date;
      page?: { id: string; name: string }; // Synced with schema
    };
    instagram: { startDate: Date; endDate: Date };
  };
  subscriptions: {
    facebook: {
      page: { id: number; name: string };
      startDate: Date;
      endDate: Date;
      status: "pending" | "running" | "expired";
      isPaid: boolean;
      payment: {
        method: string;
        trxId: string;
        amount: number;
        paidAt: Date;
      };
    }[];
    instagram: {
      user: { id: number; username: string };
      startDate: Date;
      endDate: Date;
      status: "pending" | "running" | "expired";
      isPaid: boolean;
      payment: {
        method: string;
        trxId: string;
        amount: number;
        paidAt: Date;
      };
    }[];
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
          startDate: { type: Date, default: Date.now() },
          endDate: { type: Date, default: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)  },
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
            paidAt: { type: Date, default: Date.now()},
          },
        },
      ],
      instagram: [
        {
          user: {
            id: { type: Number },
            username: { type: String },
          },
          startDate: { type: Date, default: Date.now() },
          endDate: { type: Date, default: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, 
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
            paidAt: { type: Date, default: Date.now()},
          },
        },
      ],
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
  },
);

/**
 * MIDDLEWARE: Logic to update status before saving to the database.
 */
userSchema.pre("save", function (next) {
  const now = new Date();

  // Process Facebook Subscriptions
  this.subscriptions.facebook.forEach((sub) => {
    if (new Date(sub.endDate) && now > new Date(sub.endDate)) {
      sub.status = "expired";
    }
  });

  // Process Instagram Subscriptions
  this.subscriptions.instagram.forEach((sub) => {
    if (new Date(sub.endDate) && now > new Date(sub.endDate)) {
      sub.status = "expired";
    }
  });

  next();
});

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);