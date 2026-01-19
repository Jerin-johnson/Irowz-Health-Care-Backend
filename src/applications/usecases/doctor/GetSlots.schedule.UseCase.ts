import { IDoctorSlotLock } from "../../../domain/lock/DoctorSlotLock";
import { IDoctorAvailabilityRepository } from "../../../domain/repositories/IDoctorAvailabilityRepository";
import { IDoctorAppointmentRepository } from "../../../domain/repositories/IDoctorAppointmentRepository";
import { DoctorAvailabilityEngine } from "../../../domain/services/DoctorAvailabilityEngine.service";

export interface DoctorSchudleSlot {
  startTime: string;
  endTime: string;
  status: "available" | "booked" | "blocked";
  type?: "OPD" | "Teleconsult";
  patientName?: string;
  appointmentId?: string;
}

export class GetSlotsScheduleUseCase {
  constructor(
    private readonly _DoctorAvailbilityRepo: IDoctorAvailabilityRepository,
    private readonly _DoctorAppointmentRepo: IDoctorAppointmentRepository,
    private readonly _DoctorSlotLock: IDoctorSlotLock
  ) {}

  async execute(doctorId: string, date: string): Promise<DoctorSchudleSlot[]> {
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
    return Array.from(slotMap.values()).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }
}
