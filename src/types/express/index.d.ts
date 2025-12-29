import { UserRole } from "../../domain/constants/UserRole";
import { Request } from "express";
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: UserRole;
        hospitalId?: string;
        doctorId?: string;
        patientId?: string;
      };
    }
  }
}

export type RequestExtend = Request & { user: { id: string; role: role } };
export {};
