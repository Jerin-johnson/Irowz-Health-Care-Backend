import { Schema, model, Document, Types } from "mongoose";

export interface DoctorReviewDocument extends Document {
  doctorId: Types.ObjectId;
  patientId: Types.ObjectId;

  rating: number;
  comment?: string;

  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorReviewSchema = new Schema<DoctorReviewDocument>(
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

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      maxlength: 1000,
      trim: true,
    },

    isVerified: { type: Boolean },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// DoctorReviewSchema.index({ doctorId: 1, patientId: 1 }, { unique: true });

export const DoctorReviewModel = model<DoctorReviewDocument>("DoctorReview", DoctorReviewSchema);
