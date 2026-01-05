import { DoctorSlotCache } from "../../domain/cache/DoctorSlot.cache";
import { Slot } from "../../domain/types/Slot";
import { Redis } from "ioredis";

export class RedisSlotCache implements DoctorSlotCache {
  constructor(private readonly redis: Redis) {}

  private key(doctorId: string, date: string) {
    return `slots:${doctorId}:${date}`;
  }

  async get(doctorId: string, date: string): Promise<Slot[] | null> {
    const data = await this.redis.get(this.key(doctorId, date));
    if (!data) return null;

    return JSON.parse(data) as Slot[];
  }

  async set(doctorId: string, date: string, slots: Slot[], ttlSeconds = 120): Promise<void> {
    await this.redis.set(this.key(doctorId, date), JSON.stringify(slots), "EX", ttlSeconds);
  }

  async invalidate(doctorId: string, date: string): Promise<void> {
    await this.redis.del(this.key(doctorId, date));
  }
}
