export interface IDoctorSlotLock {
  lockSlot(
    doctorId: string,
    date: string,
    startTime: string,
    userId: string,
    ttlSeconds?: number
  ): Promise<boolean>;

  lockSlotByDoctor(
    doctorId: string,
    date: string,
    startTime: string,
    reason?: string
  ): Promise<void>;

  unlockSlot(doctorId: string, date: string, startTime: string): Promise<void>;

  getLockedSlots(doctorId: string, date: string): Promise<string[]>;

  isLocked(doctorId: string, date: string, startTime: string, userId: string): Promise<boolean>;
}
