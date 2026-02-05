import { z } from "zod";

export const SubscriptionSchema = z.object({
  body: z.object({
    name: z.string().min(2, "SubscriptionNames must be at least 2 characters"),

    price: z.coerce.number().min(0, "price must be at least 0 "),

    doctorLimit: z.coerce.number().min(2, "doctor must be at least 2"),

    durationInDays: z.coerce.number().min(5, "durationInDays must be at least 2"),
    features: z.array(z.string().min(1, "At least one is requied")),
    isActive: z.coerce.boolean(),
  }),
});
