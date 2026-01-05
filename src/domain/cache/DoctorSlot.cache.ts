import { Slot } from "../types/Slot";

export interface DoctorSlotCache {
  get(doctorId: string, date: string): Promise<Slot[] | null>;

  set(doctorId: string, date: string, slots: Slot[], ttlSeconds: number): Promise<void>;

  invalidate(doctorId: string, date: string): Promise<void>;
}
