import { IDoctorSlotCache } from "../../../../domain/cache/DoctorSlot.cache";
import { IDoctorSlotLock } from "../../../../domain/lock/DoctorSlotLock";

export class UnLockDoctorSlotUseCase {
  constructor(
    private readonly _DoctorSlotLock: IDoctorSlotLock,
    private readonly _DoctorSlotCache: IDoctorSlotCache
  ) {}

  async execute(params: {
    doctorId: string;
    date: string;
    startTime: string;
  }): Promise<{ unlocked: boolean }> {
    const { doctorId, date, startTime } = params;
    await this._DoctorSlotCache.invalidate(doctorId, date);
    await this._DoctorSlotLock.unlockSlot(doctorId, date, startTime);

    return { unlocked: true };
  }
}
