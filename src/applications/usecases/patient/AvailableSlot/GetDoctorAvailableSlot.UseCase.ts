import { IDoctorSlotCache } from "../../../../domain/cache/DoctorSlot.cache";
import { IDoctorSlotLock } from "../../../../domain/lock/DoctorSlotLock";
import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { IDoctorAvailabilityRepository } from "../../../../domain/repositories/IDoctorAvailabilityRepository";
import { DoctorAvailabilityEngine } from "../../../../domain/services/DoctorAvailabilityEngine.service";
import { Slot } from "../../../../domain/types/Slot";
import { IGetDoctorAvailableSlotUseCase } from "../../../../domain/usecase/patient/Availibility/IGetDoctorAvailabileSlotUseCase";

export class GetDoctorAvailabileSlotUseCase implements IGetDoctorAvailableSlotUseCase {
  constructor(
    private readonly _DoctorAvailbilityRepo: IDoctorAvailabilityRepository,
    private readonly _DoctorAppointmentRepo: IDoctorAppointmentRepository,
    private readonly _DoctorSlotCache: IDoctorSlotCache,
    private readonly _DoctorSlotLock: IDoctorSlotLock
  ) {}

  async execute(doctorId: string, date: string): Promise<Slot[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxBookingDate = new Date(today);
    maxBookingDate.setDate(today.getDate() + 7);

    if (new Date(date) > maxBookingDate) {
      return [];
    }

    const cachedSlots = await this._DoctorSlotCache.get(doctorId, date);

    if (cachedSlots) {
      console.log("Returned from cache");
      return cachedSlots;
    }

    const availabilityConfig = await this._DoctorAvailbilityRepo.findByDoctorId(doctorId);
    if (!availabilityConfig) {
      throw new Error("Doctor does not set avalibility");
    }

    const appointments = await this._DoctorAppointmentRepo.findByDoctorAndDate(doctorId, date);

    const lockedSlots = await this._DoctorSlotLock.getLockedSlots(doctorId, date);
    console.log("The locked slots are", lockedSlots);
    const slots = DoctorAvailabilityEngine.compute(
      availabilityConfig,
      date,
      appointments,
      lockedSlots
    );

    await this._DoctorSlotCache.set(doctorId, date, slots, 120);
    return slots;
  }
}
