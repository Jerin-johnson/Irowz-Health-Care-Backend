import { IDoctorSlotCache } from "../../domain/cache/DoctorSlot.cache";
import { Slot } from "../../domain/types/Slot";
import { redisClient } from "../redis/redisClient";

export class RedisDoctorAvailabilityCache implements IDoctorSlotCache {
  private key(doctorId: string, date: string) {
    return `availability:${doctorId}:${date}`;
  }

  async get(doctorId: string, date: string) {
    const data = await redisClient.get(this.key(doctorId, date));
    return data ? JSON.parse(data) : null;
  }

  async set(doctorId: string, date: string, slots: Slot[], ttlSeconds = 300) {
    await redisClient.set(this.key(doctorId, date), JSON.stringify(slots), { EX: ttlSeconds });
  }

  async invalidate(doctorId: string, date: string) {
    await redisClient.del(this.key(doctorId, date));
  }
}
