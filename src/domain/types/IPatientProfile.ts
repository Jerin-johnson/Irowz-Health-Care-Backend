import { Types } from "mongoose";

export interface IPatientProfile {
  _id: Types.ObjectId;
  userId: Types.ObjectId;

  bloodGroup?: string;
  height?: number;
  weight?: number;

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
  allergies?: [string];
  chronicConditions?: [string];

  createdAt: Date;
  updatedAt: Date;
}
