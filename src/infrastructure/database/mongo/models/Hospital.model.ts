import mongoose, { Schema, Document } from "mongoose";

export interface HospitalDocument extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  registrationNumber: string;
  officialEmail: string;
  phone: string;
  type: "GENERAL" | "SPECIALTY";
  licenseDocumentUrl: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  isVerified: boolean;
  isBlocked?: boolean;
  verifiedAt?: Date;
  isActive: boolean;
}

const HospitalSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    name: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },

    officialEmail: { type: String, required: true },
    phone: { type: String, required: true },

    type: {
      type: String,
      enum: ["GENERAL", "SPECIALTY"],
    },

    licenseDocumentUrl: { type: String, required: true },

    city: { type: String, required: true },
    state: { type: String, required: true },

    latitude: { type: Number },
    longitude: { type: Number },

    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },

    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const HospitalModel = mongoose.model<HospitalDocument>(
  "Hospital",
  HospitalSchema
);
