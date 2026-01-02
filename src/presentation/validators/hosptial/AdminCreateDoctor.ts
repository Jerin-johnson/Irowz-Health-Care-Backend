import { z } from "zod";

export const AdminCreateDoctorSchema = z.object({
  body: z.object({
    specialtyId: z.string().min(1, "Specialty is required"),

    experienceYears: z.coerce
      .number()
      .int("Experience must be an integer")
      .min(0, "Experience cannot be negative")
      .max(60, "Experience cannot exceed 60 years"),

    consultationFee: z.coerce.number().min(0, "Consultation fee must be positive"),

    bio: z
      .string()
      .min(20, "Bio must be at least 20 characters")
      .max(2000, "Bio cannot exceed 2000 characters"),

    medicalRegistrationNumber: z
      .string()
      .min(5, "Medical registration number is too short")
      .max(50, "Medical registration number is too long"),

    medicalCouncil: z.enum(["MCI", "NMC", "STATE_MEDICAL_COUNCIL"]),

    teleConsultationEnabled: z.coerce.boolean().optional(),

    fullName: z.string().min(3, "Full name must be at least 3 characters"),

    email: z.string().email("Invalid email format"),

    phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  }),

  file: z.undefined().optional(),
  files: z.undefined().optional(),
});
