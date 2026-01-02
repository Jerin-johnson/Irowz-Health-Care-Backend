import mongoose, { Schema, Document } from "mongoose";

export interface HospitalVerificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  hospitalName: string;
  registrationNumber: string;
  hospitalAddress: string;
  city: string;
  state: string;
  pincode: string;
  officialEmail: string;
  phone: string;
  licenseDocumentUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminRemarks?: string;

  submittedAt: Date;
  reviewedAt?: Date;
}

const HospitalVerificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    hospitalName: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    hospitalAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },

    officialEmail: { type: String, required: true },
    phone: { type: String, required: true },
    licenseDocumentUrl: { type: String, required: true },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    adminRemarks: { type: String },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

export const HospitalVerificationModel = mongoose.model<HospitalVerificationDocument>(
  "HospitalVerification",
  HospitalVerificationSchema
);
