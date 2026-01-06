import { Schema, model, Types } from "mongoose";

export interface DoctorAppointmentDocument {
  _id?: Types.ObjectId;

  doctorId: Types.ObjectId;
  patientId: Types.ObjectId;
  hospitalId?: Types.ObjectId;

  date: string;
  startTime: string;
  endTime: string;
  timezone: string;

  visitType: "IN_PERSON" | "ONLINE";

  consultationFee: number;
  discountAmount: number;
  taxAmount?: number;
  totalAmount: number;

  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";

  paymentMethod?: "CARD" | "UPI" | "NET_BANKING" | "WALLET" | "CASH";
  transactionId?: string;

  refund?: {
    amount: number;
    refundedAt: Date;
    reason?: string;
  };

  status: "PENDING" | "BOOKED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";

  cancelledAt?: Date;
  cancelReason?: string;

  startedAt?: Date;
  completedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const DoctorAppointmentSchema = new Schema<DoctorAppointmentDocument>(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      index: true,
    },

    date: { type: String, required: true, index: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },

    timezone: { type: String, default: "Asia/Kolkata" },

    visitType: {
      type: String,
      enum: ["IN_PERSON", "ONLINE"],
      required: true,
    },

    consultationFee: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    taxAmount: { type: Number },
    totalAmount: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"],
      default: "PENDING",
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: ["CARD", "UPI", "NET_BANKING", "WALLET", "CASH"],
    },

    transactionId: String,

    refund: {
      amount: Number,
      refundedAt: Date,
      reason: String,
    },

    status: {
      type: String,
      enum: ["PENDING", "BOOKED", "CANCELLED", "COMPLETED", "NO_SHOW"],
      default: "PENDING",
      index: true,
    },

    cancelledAt: Date,
    cancelReason: String,

    startedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

DoctorAppointmentSchema.index({ doctorId: 1, date: 1, startTime: 1 }, { unique: true });

export const DoctorAppointmentModel = model<DoctorAppointmentDocument>(
  "DoctorAppointment",
  DoctorAppointmentSchema
);
