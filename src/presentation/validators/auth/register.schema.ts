import { z } from "zod";
import UserRoles from "../../../domain/constants/UserRole";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    password: z.string().min(8),
    role: z.enum(Object.values(UserRoles)),
  }),
});
