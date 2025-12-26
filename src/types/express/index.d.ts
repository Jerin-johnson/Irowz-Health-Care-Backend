import { UserRole } from "../../domain/constants/UserRole";
import { Request } from "express";
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: UserRole;
      };
    }
  }
}

export type RequestExtend = Request & { user: { id: string; role: role } };
export {};
