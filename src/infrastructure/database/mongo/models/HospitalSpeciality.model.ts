import { Schema, model, Types } from "mongoose";

export interface IHospitalSpecialty {
  _id?: Types.ObjectId;

  hospitalId: Types.ObjectId;

  name: string;
  description: string;

  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

const HospitalSpecialtySchema = new Schema<IHospitalSpecialty>(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

HospitalSpecialtySchema.index({ hospitalId: 1, name: 1 }, { unique: true });

export const HospitalSpecialtyModel = model<IHospitalSpecialty>(
  "HospitalSpecialty",
  HospitalSpecialtySchema
);
