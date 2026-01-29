import { z } from "zod";

export const patientProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),

    mobile: z.string().min(8, "Mobile number must be at least 8 digits"),

    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      }),

    gender: z.string().min(1, "Gender is required"),

    bloodGroup: z.string().min(1, "Blood group is required"),

    height: z.coerce.number().min(30, "Height must be at least 30 cm"),

    weight: z.coerce.number().min(10, "Weight must be at least 10 kg"),

    state: z.string().min(1, "State is required"),

    city: z.string().min(1, "City is required"),

    pincode: z.string().min(4, "Pincode must be at least 4 characters"),

    address: z.string().min(5, "Address must be at least 5 characters"),
    allergies: z.array(z.string()).optional(),
    chronicConditions: z.array(z.string()).optional(),
  }),

  // optional file support (profile image)
  file: z.any().optional(),

  files: z.any().optional(),
});
