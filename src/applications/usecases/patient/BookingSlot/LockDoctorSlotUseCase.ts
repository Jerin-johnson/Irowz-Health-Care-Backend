import { IDoctorSlotCache } from "../../../../domain/cache/DoctorSlot.cache";
import { IDoctorSlotLock } from "../../../../domain/lock/DoctorSlotLock";

export class LockDoctorSlotUseCase {
  constructor(
    private readonly _DoctorSlotLock: IDoctorSlotLock,
    private readonly _DoctorSlotCache: IDoctorSlotCache
  ) {}

  async execute(params: {
    doctorId: string;
    date: string;
    startTime: string;
    userId: string;
  }): Promise<{ locked: boolean }> {
    const { doctorId, date, startTime, userId } = params;
    const locked = await this._DoctorSlotLock.lockSlot(doctorId, date, startTime, userId, 700);

    if (!locked) {
      return { locked: false };
    }

    await this._DoctorSlotCache.invalidate(doctorId, date);

    return { locked: true };
  }
}
