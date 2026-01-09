import { IDoctorSlotLock } from "../../domain/lock/DoctorSlotLock";
import { redisClient } from "../redis/redisClient";

export class RedisDoctorSlotLockService implements IDoctorSlotLock {
  private key(doctorId: string, date: string, startTime: string) {
    return `lock:${doctorId}:${date}:${startTime}`;
  }

  async lockSlot(
    doctorId: string,
    date: string,
    startTime: string,
    userId: string,
    ttlSeconds = 300
  ): Promise<boolean> {
    const result = await redisClient.set(this.key(doctorId, date, startTime), userId, {
      NX: true,
      EX: ttlSeconds,
    });

    return result === "OK";
  }

  async unlockSlot(doctorId: string, date: string, startTime: string) {
    await redisClient.del(this.key(doctorId, date, startTime));
  }

  async getLockedSlots(doctorId: string, date: string): Promise<string[]> {
    const keys = await redisClient.keys(`lock:${doctorId}:${date}:*`);
    console.log(keys);
    return keys.map((k) => k.slice(-5));
  }

  async isLocked(
    doctorId: string,
    date: string,
    startTime: string,
    userId: string
  ): Promise<boolean> {
    const key = this.key(doctorId, date, startTime);
    const value = await redisClient.get(key);
    console.log(value, userId);
    return value == userId;
  }
}
