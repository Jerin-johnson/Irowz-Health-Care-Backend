import { DoctorSlotLock } from "../../domain/lock/DoctorSlotLock";
import { Redis } from "ioredis";

export class RedisSlotLock implements DoctorSlotLock {
  constructor(private readonly redis: Redis) {}

  private key(doctorId: string, date: string, startTime: string) {
    return `lock:${doctorId}:${date}:${startTime}`;
  }

  async acquire(
    doctorId: string,
    date: string,
    startTime: string,
    ownerId: string
  ): Promise<boolean> {
    const result = await this.redis.set(
      this.key(doctorId, date, startTime),
      ownerId,
      "NX",
      "EX",
      120
    );

    return result === "OK";
  }

  async release(doctorId: string, date: string, startTime: string, ownerId: string): Promise<void> {
    const key = this.key(doctorId, date, startTime);

    // Safe unlock (only owner can release)
    const lua = `
      if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("DEL", KEYS[1])
      else
        return 0
      end
    `;

    await this.redis.eval(lua, 1, key, ownerId);
  }
}
