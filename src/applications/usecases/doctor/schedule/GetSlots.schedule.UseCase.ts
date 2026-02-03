import { IDoctorSlotLock } from "../../../../domain/lock/DoctorSlotLock";
import { IDoctorAvailabilityRepository } from "../../../../domain/repositories/IDoctorAvailabilityRepository";
import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { DoctorAvailabilityEngine } from "../../../../domain/services/DoctorAvailabilityEngine.service";
import { IGetSlotsScheduleUseCase } from "../../../../domain/usecase/doctor/schudele/IGetSlotsScheduleUseCase";

export interface DoctorSchudleSlot {
  startTime: string;
  endTime: string;
  status: "available" | "booked" | "blocked";
  type?: "OPD" | "Teleconsult";
  patientName?: string;
  appointmentId?: string;
}

const isPastDate = (date: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [y, m, d] = date.split("-").map(Number);
  const target = new Date(y, m - 1, d, 0, 0, 0, 0);

  return target.getTime() < today.getTime();
};

export class GetSlotsScheduleUseCase implements IGetSlotsScheduleUseCase {
  constructor(
    private readonly _DoctorAvailbilityRepo: IDoctorAvailabilityRepository,
    private readonly _DoctorAppointmentRepo: IDoctorAppointmentRepository,
    private readonly _DoctorSlotLock: IDoctorSlotLock
  ) {}

  async execute(doctorId: string, date: string): Promise<DoctorSchudleSlot[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxBookingDate = new Date(today);
    maxBookingDate.setDate(today.getDate() + 14);

    if (new Date(date) > maxBookingDate) {
      return [];
    }

    const availability = await this._DoctorAvailbilityRepo.findByDoctorId(doctorId);
    if (!availability) {
      throw new Error("Doctor availability not configured");
    }

    const appointments = await this._DoctorAppointmentRepo.findByDoctorAndDate(doctorId, date);
    const lockedSlots = await this._DoctorSlotLock.getLockedSlots(doctorId, date);

    const computedAvailableSlots = DoctorAvailabilityEngine.compute(
      availability,
      date,
      appointments,
      lockedSlots
    );

    const bookedSlots: DoctorSchudleSlot[] = appointments.map((a) => ({
      startTime: a.startTime,
      endTime: a.endTime,
      status: "booked",
      type: a.visitType === "ONLINE" ? "Teleconsult" : "OPD",
      patientName: `${a.patientSnapshot.firstName} ${a.patientSnapshot.lastName}`,
      appointmentId: a._id?.toString(),
    }));

    const blockedSlots: DoctorSchudleSlot[] = lockedSlots.map((startTime) => {
      const slot = computedAvailableSlots.find((s) => s.startTime === startTime);

      return {
        startTime,
        endTime: slot?.endTime ?? "",
        status: "blocked",
      };
    });

    const availableSlots: DoctorSchudleSlot[] = computedAvailableSlots.map((s) => ({
      startTime: s.startTime,
      endTime: s.endTime,
      status: "available",
    }));

    const slotMap = new Map<string, DoctorSchudleSlot>();

    [...availableSlots, ...blockedSlots, ...bookedSlots].forEach((slot) => {
      slotMap.set(slot.startTime, slot);
    });

    const finalSlots: DoctorSchudleSlot[] = Array.from(slotMap.values()).map(
      (slot): DoctorSchudleSlot => {
        if (slot.status === "available" && isPastDate(date)) {
          return {
            ...slot,
            status: "blocked",
          };
        }

        return slot;
      }
    );

    return finalSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }
}
