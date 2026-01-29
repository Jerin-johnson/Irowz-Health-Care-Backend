import { Schema, model, Types } from "mongoose";

export interface IPatientProfile {
  userId: Types.ObjectId;

  bloodGroup?: string;
  height?: number;
  weight?: number;
  allergies?: [string];
  chronicConditions?: [string];
  address?: {
    state: string;
    city: string;
    pincode: string;
    addressLine: string;
  };

  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const patientProfileSchema = new Schema<IPatientProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bloodGroup: String,
    height: Number,
    weight: Number,

    address: {
      state: String,
      city: String,
      pincode: String,
      addressLine: String,
    },
    allergies: [
      {
        type: String,
      },
    ],
    chronicConditions: [
      {
        type: String,
      },
    ],

    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },
  },
  { timestamps: true }
);

export const PatientProfile = model<IPatientProfile>("PatientProfile", patientProfileSchema);
