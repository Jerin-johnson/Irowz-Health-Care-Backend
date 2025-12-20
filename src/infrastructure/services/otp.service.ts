import crypto from "crypto";
import bcrypt from "bcrypt";
import { IOtpService } from "../../domain/services/otp.interface.service";

export class RandomOtpService implements IOtpService {
  generate() {
    return crypto.randomInt(100000, 999999).toString();
  }
  async hash(otp: string) {
    return bcrypt.hash(otp, 10);
  }
  async compare(otp: string, hash: string) {
    return bcrypt.compare(otp, hash);
  }
}
