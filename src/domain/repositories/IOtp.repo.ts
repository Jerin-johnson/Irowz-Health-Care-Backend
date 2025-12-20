import { Otp } from "../types/IOtp.types";

export interface OtpRepository {
  save(otp: Otp): Promise<void>;
  findByUserId(userId: string): Promise<null | Otp>;
  deleteByUserId(userId: string): Promise<void>;
}
