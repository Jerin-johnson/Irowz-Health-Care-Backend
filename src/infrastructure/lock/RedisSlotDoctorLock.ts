import { IDoctorSlotLock } from "../../domain/lock/DoctorSlotLock";
import { redisClient } from "../redis/redisClient";

export class RedisDoctorSlotLockService implements IDoctorSlotLock {
  private key(doctorId: string, date: string, startTime: string) {
    return `lock:${doctorId}:${date}:${startTime}`;
  }

  private calculateTTL(date: string): number {
    const now = new Date();
    const [y, m, d] = date.split("-").map(Number);

    const endOfDay = new Date(y, m - 1, d, 23, 59, 59, 999);
    const ttlMs = endOfDay.getTime() - now.getTime();

    return ttlMs > 0 ? Math.ceil(ttlMs / 1000) : 1;
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

  async lockSlotByDoctor(
    doctorId: string,
    date: string,
    startTime: string,
    reason = "Doctor blocked"
  ) {
    const ttlSeconds = this.calculateTTL(date);

    await redisClient.set(
      this.key(doctorId, date, startTime),
      JSON.stringify({ lockedBy: "DOCTOR", reason }),
      {
        NX: true,
        EX: ttlSeconds,
      }
    );
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
