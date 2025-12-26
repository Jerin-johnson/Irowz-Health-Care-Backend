import { OtpRepository } from "../../domain/repositories/IOtp.repo";
import { redisClient } from "../redis/redisClient";

export class RedisOtpRepository implements OtpRepository {
  private key(email: string) {
    return `otp:${email}`;
  }

  async save(email: string, otpHash: string, ttlSeconds: number) {
    await redisClient.set(
      this.key(email),
      otpHash,
      { EX: ttlSeconds } // auto expiry
    );
  }

  async findByUserEmail(email: string) {
    const otpHash = await redisClient.get(this.key(email));
    if (!otpHash) return null;
    return { otpHash };
  }

  async deleteByEmail(email: string) {
    await redisClient.del(this.key(email));
  }
}
