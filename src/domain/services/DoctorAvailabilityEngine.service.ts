import { DoctorAvailability } from "../types/DoctorAvailability";
import { Slot, AppointmentLike } from "../types/Slot";
import { timeToMinutes, minutesToTime, getWeekDay } from "../utils/time.utils";

export class DoctorAvailabilityEngine {
  static compute(
    availability: DoctorAvailability,
    date: string,
    appointments: AppointmentLike[],
    lockedSlots: string[]
  ): Slot[] {
    const weekDay = getWeekDay(date);

    const dayConfig = availability.weeklySchedule.find((d) => d.day == weekDay);

    if (!dayConfig || !dayConfig.isWorking || !dayConfig.workingHours) {
      return [];
    }

    const workStart = timeToMinutes(dayConfig.workingHours.start);
    const workEnd = timeToMinutes(dayConfig.workingHours.end);

    const slotDuration = availability.slotDurationMinutes;

    const breakStart = dayConfig.breakTime ? timeToMinutes(dayConfig.breakTime.start) : null;

    const breakEnd = dayConfig.breakTime ? timeToMinutes(dayConfig.breakTime.end) : null;

    const blockedRanges = appointments
      .filter((a) => a.status === "BOOKED" || a.status === "PENDING")
      .map((a) => ({
        start: timeToMinutes(a.startTime),
        end: timeToMinutes(a.endTime),
      }));

    console.log("the blocker range compute engiene", blockedRanges);

    if (blockedRanges.length >= availability.maxPatientsPerDay) {
      return [];
    }

    const slots: Slot[] = [];

    for (let cursor = workStart; cursor + slotDuration <= workEnd; cursor += slotDuration) {
      const slotStart = cursor;
      const slotEnd = cursor + slotDuration;

      const slotStartTime = minutesToTime(slotStart);

      if (
        breakStart !== null &&
        breakEnd !== null &&
        slotStart < breakEnd &&
        slotEnd > breakStart
      ) {
        continue;
      }

      const overlapsBooked = blockedRanges.some((b) => slotStart < b.end && slotEnd > b.start);

      if (overlapsBooked) continue;

      //Redis-locked slot

      if (lockedSlots.includes(slotStartTime)) continue;

      //  Slot is available

      slots.push({
        startTime: slotStartTime,
        endTime: minutesToTime(slotEnd),
      });
    }

    return slots;
  }
}
