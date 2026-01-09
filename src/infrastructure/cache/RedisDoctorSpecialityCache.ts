import { Types } from "mongoose";
import { redisClient } from "../redis/redisClient";

export class RedisDoctorSpecialityCache {
  private key() {
    return `doctor:speciality`;
  }

  async get() {
    const data = await redisClient.get(this.key());
    return data ? JSON.parse(data) : null;
  }

  async set(speciality: { _id: string | Types.ObjectId; name: string }[], ttlSeconds = 300) {
    await redisClient.set(this.key(), JSON.stringify(speciality), { EX: ttlSeconds });
  }

  async invalidate() {
    await redisClient.del(this.key());
  }
}
