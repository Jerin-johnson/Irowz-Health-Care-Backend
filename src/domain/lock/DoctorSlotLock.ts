export interface IDoctorSlotLock {
  lockSlot(
    doctorId: string,
    date: string,
    startTime: string,
    userId: string,
    ttlSeconds?: number
  ): Promise<boolean>;

  unlockSlot(doctorId: string, date: string, startTime: string): Promise<void>;

  getLockedSlots(doctorId: string, date: string): Promise<string[]>;
}
