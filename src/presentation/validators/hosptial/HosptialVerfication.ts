import { z } from "zod";

export const hospitalVerificationBodySchema = z.object({
  body: z.object({
    hospitalName: z.string().min(2, "Hospital name must be at least 2 characters"),

    registrationNumber: z.string().min(3, "Registration number is required"),

    hospitalAddress: z.string().min(10, "Address must be at least 10 characters"),

    city: z.string().min(2, "City is required"),

    state: z.string().min(2, "State is required"),

    officialEmail: z.string().email("Invalid official email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),

    pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  }),

  file: z.any().refine(Boolean, "License document is required"),
});
