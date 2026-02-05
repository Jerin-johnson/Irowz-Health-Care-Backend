import { Document, Types, Schema, model } from "mongoose";

export interface HospitalSubscriptionDocument extends Document {
  hospitalId: Types.ObjectId | string;
  planId: Types.ObjectId;

  doctorLimitSnapshot: number;
  priceSnapshot: number;
  durationSnapshot: number;

  startDate: Date;
  endDate: Date;

  status: "ACTIVE" | "EXPIRED" | "CANCELLED";

  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<HospitalSubscriptionDocument>(
  {
    hospitalId: {
      type: Types.ObjectId,
      ref: "Hospital",
      required: true,
    },

    planId: {
      type: Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },

    doctorLimitSnapshot: { type: Number, required: true },

    priceSnapshot: { type: Number, required: true },

    durationSnapshot: { type: Number, required: true },

    startDate: { type: Date, required: true },

    endDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "CANCELLED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export const HospitalSubscriptionModel = model<HospitalSubscriptionDocument>(
  "HospitalSubscription",
  schema
);
