import { Schema, model, Types, Document } from "mongoose";

const PrescriptionSchema = new Schema(
  {
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true }, // e.g. 500mg
    frequency: { type: String, required: true }, // e.g. twice a day
    duration: { type: String, required: true }, // e.g. 5 days
    instructions: { type: String }, // optional notes
  },
  { _id: false }
);

const LabTestSchema = new Schema(
  {
    testName: { type: String, required: true }, // e.g. CBC
    description: { type: String }, // optional reason
    reportUrl: { type: String }, // uploaded report
    status: {
      type: String,
      enum: ["ORDERED", "RECEIVED"],
      default: "ORDERED",
    },
  },
  { _id: false }
);

export interface MedicalRecordDocument extends Document {
  // _id?: Types.ObjectId;

  appointmentId: Types.ObjectId; // 🔑 one-to-one with appointment
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  hospitalId?: Types.ObjectId;

  visitType: "OPD" | "ONLINE";
  visitDate: Date;

  diagnosisSummary?: string;
  observationNotes?: string;
  clinicalObservations?: string;

  prescriptions: {
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];

  labTests: {
    testName: string;
    description?: string;
    reportUrl?: string;
    status: "ORDERED" | "RECEIVED";
  }[];

  followUpDate?: Date;

  status: "DRAFT" | "COMPLETED" | "LOCKED";
  externalUpload: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const MedicalRecordSchema = new Schema<MedicalRecordDocument>(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "DoctorAppointment",
      required: true,
      unique: true, //  one record per visit
      index: true,
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      index: true,
    },

    visitType: {
      type: String,
      enum: ["OPD", "ONLINE"],
      required: true,
    },

    visitDate: {
      type: Date,
      required: true,
    },

    diagnosisSummary: {
      type: String,
    },

    clinicalObservations: {
      type: String,
    },

    observationNotes: {
      type: String,
    },

    prescriptions: {
      type: [PrescriptionSchema],
      default: [],
    },

    labTests: {
      type: [LabTestSchema],
      default: [],
    },

    followUpDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["DRAFT", "COMPLETED", "LOCKED"],
      default: "DRAFT",
      index: true,
    },

    externalUpload: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* ----------------------------------
   Export Model
----------------------------------- */
export const MedicalRecordModel = model<MedicalRecordDocument>(
  "MedicalRecord",
  MedicalRecordSchema
);
