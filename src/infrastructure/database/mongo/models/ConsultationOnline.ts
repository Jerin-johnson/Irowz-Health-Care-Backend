import { Schema, model, Types, Document } from "mongoose";

export interface ConsultationOnlineDocument extends Document {
  // _id?: Types.ObjectId;

  appointmentId: Types.ObjectId | string;
  doctorId: Types.ObjectId | string;
  patientId: Types.ObjectId | string;

  provider: "ZEGOCLOUD";
  roomId: string;

  status: "IDLE" | "CALLING" | "RINGING" | "IN_PROGRESS" | "REJECTED" | "ENDED";

  startedAt?: Date;
  endedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const ConsultationSchema = new Schema(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "DoctorAppointment",
      unique: true,
      required: true,
    },

    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    provider: { type: String, enum: ["ZEGOCLOUD"], required: true },
    roomId: { type: String, required: true },

    status: {
      type: String,
      enum: ["IDLE", "CALLING", "RINGING", "IN_PROGRESS", "REJECTED", "ENDED"],
      default: "IDLE",
      index: true,
    },

    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true }
);

export const ConsultationModel = model<ConsultationOnlineDocument>(
  "Consultation",
  ConsultationSchema
);
