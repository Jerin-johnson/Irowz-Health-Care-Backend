import { Types, Schema, model } from "mongoose";
import { WeeklySchedule } from "../../../../domain/types/WeeklySchdule.types";

export interface DoctorAvailabilityDocument extends Document {
  _id?: Types.ObjectId;
  doctorId: Types.ObjectId;

  weeklySchedule: {
    day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
    isWorking: boolean;

    workingHours?: {
      start: string; // HH:mm
      end: string; // HH:mm
    };

    breakTime?: {
      start: string;
      end: string;
    };
  }[];

  slotDurationMinutes: number;

  maxPatientsPerDay: number;

  teleConsultationEnabled: boolean;
  timezone: string;
  doctorDelayMinutes?: number; // default 0
  doctorDelayedAt?: Date; // null initially

  createdAt: Date;
  updatedAt: Date;
}

const WeeklyScheduleSchema = new Schema(
  {
    day: {
      type: String,
      enum: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
      required: true,
    },

    isWorking: { type: Boolean, required: true },

    workingHours: {
      start: { type: String },
      end: { type: String },
    },

    breakTime: {
      start: { type: String },
      end: { type: String },
    },
  },
  { _id: false }
);

const DoctorAvailabilitySchema = new Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      unique: true,
      index: true,
    },

    weeklySchedule: {
      type: [WeeklyScheduleSchema],
      required: true,
      validate: {
        validator: (v: WeeklySchedule[]) => v.length === 7,
        message: "Weekly schedule must have 7 days",
      },
    },

    slotDurationMinutes: {
      type: Number,
      required: true,
      min: 5,
      max: 120,
    },

    maxPatientsPerDay: {
      type: Number,
      required: true,
      min: 1,
    },

    teleConsultationEnabled: {
      type: Boolean,
      default: false,
    },
    doctorDelayMinutes: Number, // default 0
    doctorDelayedAt: Date,

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
  },
  { timestamps: true }
);

export const DoctorAvailabilityModel = model<DoctorAvailabilityDocument>(
  "DoctorAvailability",
  DoctorAvailabilitySchema
);
