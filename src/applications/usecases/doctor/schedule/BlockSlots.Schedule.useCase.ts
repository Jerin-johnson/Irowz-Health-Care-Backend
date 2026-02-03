import { IDoctorSlotLock } from "../../../../domain/lock/DoctorSlotLock";
import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { IBlockDoctorSlotUseCase } from "../../../../domain/usecase/doctor/schudele/IBlockDoctorSlotUseCase";

export class BlockDoctorSlotUseCase implements IBlockDoctorSlotUseCase {
  constructor(
    private readonly _slotLock: IDoctorSlotLock,
    private readonly _appointmentRepo: IDoctorAppointmentRepository
  ) {}

  async execute(doctorId: string, date: string, startTime: string, reason?: string) {
    //  Prevent blocking booked slot
    const existing = await this._appointmentRepo.exists(doctorId, date, startTime);

    console.log("the reason", reason);

    if (existing) {
      throw new Error("Cannot block a booked slot");
    }

    await this._slotLock.lockSlotByDoctor(doctorId, date, startTime);
  }
}
