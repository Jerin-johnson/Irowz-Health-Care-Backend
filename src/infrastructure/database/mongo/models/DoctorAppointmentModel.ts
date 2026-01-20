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

  visitType: "OPD" | "ONLINE";

  // Checkout snapshot
  patientSnapshot: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };

  addressSnapshot?: {
    country: string;
    state: string;
    city: string;
    zip: string;
    street: string;
    apartment?: string;
  };

  notes?: string;

  // Payment snapshot
  consultationFee: number;
  discountAmount: number;
  taxAmount?: number;
  totalAmount: number;

  paymentStatus:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED"
    | "PARTIALLY_REFUNDED"
    | "CANCELLED"
    | "EXPIRED";

  paymentMethod: "RAZORPAY";
  transactionId?: string;
  queuePriority: number;
  isLate?: boolean; // patient arrived late
  lateArrivedAt?: Date; // when patient arrived late
  delayReason?: string; // doctor delay / admin note
  noShowMarkedAt?: Date; // when doctor marked no-show

  refund?: {
    amount: number;
    refundedAt: Date;
    reason?: string;
  };

  razorpayOrderId?: string;

  status: "PENDING" | "BOOKED" | "CANCELLED" | "COMPLETED" | "NO_SHOW" | "STARTED"; //Booked means schedueled

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
    endTime: { type: String },
    timezone: { type: String, default: "Asia/Kolkata" },

    visitType: {
      type: String,
      enum: ["OPD", "ONLINE"],
      required: true,
    },

    // 🔹 Checkout snapshot
    patientSnapshot: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },

    addressSnapshot: {
      country: String,
      state: String,
      city: String,
      zip: String,
      street: String,
      apartment: String,
    },

    razorpayOrderId: String,

    notes: String,

    consultationFee: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    taxAmount: Number,
    totalAmount: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED", "EXPIRED"],
      default: "PENDING",
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: ["RAZORPAY"],
      required: true,
    },

    transactionId: String,

    queuePriority: { type: Number, required: true, index: true },
    isLate: { type: Boolean, default: false },
    delayReason: String,
    noShowMarkedAt: Date,
    lateArrivedAt: Date,

    refund: {
      amount: Number,
      refundedAt: Date,
      reason: String,
    },

    status: {
      type: String,
      enum: ["PENDING", "BOOKED", "CANCELLED", "COMPLETED", "NO_SHOW", "STARTED"],
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

DoctorAppointmentSchema.index({
  doctorId: 1,
  date: 1,
  queuePriority: 1,
  status: 1,
});

export const DoctorAppointmentModel = model<DoctorAppointmentDocument>(
  "DoctorAppointment",
  DoctorAppointmentSchema
);
