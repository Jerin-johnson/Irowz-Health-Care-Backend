export interface DoctorSlotLock {
  acquire(doctorId: string, date: string, startTime: string, ownerId: string): Promise<boolean>;

  release(doctorId: string, date: string, startTime: string, ownerId: string): Promise<void>;
}
