import { Schema, model, Types, Document } from "mongoose";

export interface HospitalLabOrderDocument extends Document {
  appointmentId: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  hospitalId: Types.ObjectId;

  tests: {
    testName: string;
    category: string;
  }[];

  clinicalReason?: string;

  status: "PENDING" | "RESULT_UPLOADED";

  createdAt: Date;
  updatedAt: Date;
}

const HospitalLabOrderSchema = new Schema<HospitalLabOrderDocument>(
  {
    appointmentId: { type: Types.ObjectId, required: true, ref: "DoctorAppointment" },
    patientId: { type: Types.ObjectId, required: true, ref: "User" },
    doctorId: { type: Types.ObjectId, required: true, ref: "Doctor" },
    hospitalId: { type: Types.ObjectId, required: true, ref: "Hospital" },
    tests: [
      {
        testName: { type: String, required: true },
        category: { type: String, required: true },
      },
    ],

    clinicalReason: String,

    status: {
      type: String,
      enum: ["PENDING", "RESULT_UPLOADED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const HospitalLabOrderModel = model<HospitalLabOrderDocument>(
  "HospitalLabOrder",
  HospitalLabOrderSchema
);
