import { Schema, model } from "mongoose";
import { Document } from "mongoose";

export interface SubscriptionPlanDocument extends Document {
  name: string;
  price: number;
  durationInDays: number;
  doctorLimit: number;

  features: string[];

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const subscriptionPlanSchema = new Schema<SubscriptionPlanDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    durationInDays: {
      type: Number,
      required: true,
      min: 1,
    },

    doctorLimit: {
      type: Number,
      required: true,
      min: 1,
    },

    features: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const SubscriptionPlanModel = model<SubscriptionPlanDocument>(
  "SubscriptionPlan",
  subscriptionPlanSchema
);
