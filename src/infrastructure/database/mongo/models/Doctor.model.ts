import { Schema, model, Document, Types } from "mongoose";
export interface DoctorDocument extends Document {
  userId: Types.ObjectId | string;
  hospitalId: Types.ObjectId | string;

  fullName: string;
  email: string;
  phone: string;

  specialtyId: Types.ObjectId | string;

  experienceYears: number;
  consultationFee: number;
  bio: string;

  medicalRegistrationNumber: string;
  medicalCouncil: "MCI" | "NMC" | "STATE_MEDICAL_COUNCIL";
  medicalCertificate: string;

  teleConsultationEnabled: boolean;

  averageRating: number;
  totalReviews: number;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new Schema<DoctorDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },

    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: [true, "Hospital reference is required"],
      index: true,
    },

    specialtyId: {
      type: Schema.Types.ObjectId,
      ref: "HospitalSpecialty",
      required: [true, "Specialty is required"],
      index: true,
    },

    experienceYears: {
      type: Number,
      required: [true, "Experience is required"],
      min: [0, "Experience cannot be negative"],
      max: [60, "Experience cannot exceed 60 years"],
    },

    consultationFee: {
      type: Number,
      required: [true, "Consultation fee is required"],
      min: [0, "Consultation fee must be positive"],
      max: [100000, "Consultation fee is too high"],
    },

    bio: {
      type: String,
      required: [true, "Bio is required"],
      minlength: [20, "Bio must be at least 50 characters"],
      maxlength: [2000, "Bio cannot exceed 2000 characters"],
    },

    medicalRegistrationNumber: {
      type: String,
      required: [true, "Medical registration number is required"],
      trim: true,
      minlength: [5, "Registration number is too short"],
      maxlength: [50, "Registration number is too long"],
    },

    medicalCouncil: {
      type: String,
      enum: {
        values: ["MCI", "NMC", "STATE_MEDICAL_COUNCIL"],
        message: "Invalid medical council",
      },
      required: [true, "Medical council is required"],
    },

    medicalCertificate: {
      type: String,
      required: [true, "Medical certificate is required"],
      //   validate: {
      //     validator: (value: string) => validator.isURL(value),
      //     message: "Medical certificate must be a valid URL",
      //   },
    },

    teleConsultationEnabled: {
      type: Boolean,
      default: false,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: [0, "Total reviews cannot be negative"],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

DoctorSchema.index({ hospitalId: 1, medicalRegistrationNumber: 1 }, { unique: true });

export const DoctorModel = model<DoctorDocument>("Doctor", DoctorSchema);
