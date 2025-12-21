import { OtpRepository } from "../../domain/repositories/IOtp.repo";
import { redisClient } from "../redis/redisClient";

export class RedisOtpRepository implements OtpRepository {
  private key(userId: string) {
    return `otp:${userId}`;
  }

  async save(userId: string, otpHash: string, ttlSeconds: number) {
    await redisClient.set(
      this.key(userId),
      otpHash,
      { EX: ttlSeconds } // auto expiry
    );
  }

  async findByUserId(userId: string) {
    const otpHash = await redisClient.get(this.key(userId));
    if (!otpHash) return null;
    return { otpHash };
  }

  async deleteByUserId(userId: string) {
    await redisClient.del(this.key(userId));
  }
}
