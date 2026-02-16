import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { DoctorAvailability } from "../types/DoctorAvailability";
import { Slot, AppointmentLike } from "../types/Slot";
import { timeToMinutes, minutesToTime, getWeekDay } from "../utils/time.utils";

dayjs.extend(utc);
dayjs.extend(timezone);

export class DoctorAvailabilityEngine {
  static compute(
    availability: DoctorAvailability,
    date: string,
    appointments: AppointmentLike[],
    lockedSlots: string[]
  ): Slot[] {
    const weekDay = getWeekDay(date);
    const dayConfig = availability.weeklySchedule.find((d) => d.day === weekDay && d.isWorking);
    if (!dayConfig?.workingHours?.start || !dayConfig?.workingHours?.end) {
      return [];
    }

    const workStart = timeToMinutes(dayConfig.workingHours.start);
    const workEnd = timeToMinutes(dayConfig.workingHours.end);
    const slotDuration = availability.slotDurationMinutes;
    const breakStart =
      dayConfig.breakTime?.start && dayConfig.breakTime?.end
        ? timeToMinutes(dayConfig.breakTime.start)
        : null;
    const breakEnd =
      dayConfig.breakTime?.start && dayConfig.breakTime?.end
        ? timeToMinutes(dayConfig.breakTime.end)
        : null;
    const bookedAppointments = appointments.filter(
      (a) => a.status === "BOOKED" || a.status === "PENDING"
    );
    if (bookedAppointments.length >= availability.maxPatientsPerDay) {
      return [];
    }
    const blockedRanges = bookedAppointments.map((a) => ({
      start: timeToMinutes(a.startTime),
      end: timeToMinutes(a.startTime) + slotDuration,
    }));

    let minStartMinutes = workStart;
    const now = dayjs().tz("Asia/Kolkata");
    const isToday = date === now.format("YYYY-MM-DD");

    if (isToday) {
      const nowPlusBuffer = now.hour() * 60 + now.minute() + 10;

      const alignedStart = Math.ceil(nowPlusBuffer / slotDuration) * slotDuration;

      minStartMinutes = Math.max(workStart, alignedStart);
    }

    const slots: Slot[] = [];
    for (let cursor = minStartMinutes; cursor + slotDuration <= workEnd; cursor += slotDuration) {
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
      if (blockedRanges.some((b) => slotStart < b.end && slotEnd > b.start)) {
        continue;
      }
      if (lockedSlots.includes(slotStartTime)) continue;
      slots.push({
        startTime: slotStartTime,
        endTime: minutesToTime(slotEnd),
        available: true,
        slots: 1,
      });
    }
    return slots;
  }
}

//   static compute(
//     availability: DoctorAvailability,
//     date: string,
//     appointments: AppointmentLike[],
//     lockedSlots: string[]
//   ): Slot[] {
//     const weekDay = getWeekDay(date);
//     const dayConfig = availability.weeklySchedule.find((d) => d.day == weekDay);
//     if (!dayConfig || !dayConfig.isWorking || !dayConfig.workingHours) {
//       return [];
//     }
//     const workStart = timeToMinutes(dayConfig.workingHours.start);
//     const workEnd = timeToMinutes(dayConfig.workingHours.end);
//     const slotDuration = availability.slotDurationMinutes;
//     const breakStart = dayConfig.breakTime ? timeToMinutes(dayConfig.breakTime.start) : null;
//     const breakEnd = dayConfig.breakTime ? timeToMinutes(dayConfig.breakTime.end) : null;
//     const blockedRanges = appointments
//       .filter((a) => a.status === "BOOKED" || a.status === "PENDING")
//       .map((a) => ({
//         start: timeToMinutes(a.startTime),
//         end: timeToMinutes(a.endTime),
//       }));
//     console.log("the blocker range compute engiene", blockedRanges);
//     if (blockedRanges.length >= availability.maxPatientsPerDay) {
//       return [];
//     }
//     const slots: Slot[] = [];
//     for (let cursor = workStart; cursor + slotDuration <= workEnd; cursor += slotDuration) {
//       const slotStart = cursor;
//       const slotEnd = cursor + slotDuration;
//       const slotStartTime = minutesToTime(slotStart);
//       if (
//         breakStart !== null &&
//         breakEnd !== null &&
//         slotStart < breakEnd &&
//         slotEnd > breakStart
//       ) {
//         continue;
//       }
//       const overlapsBooked = blockedRanges.some((b) => slotStart < b.end && slotEnd > b.start);
//       if (overlapsBooked) continue;
//       //Redis-locked slot
//       if (lockedSlots.includes(slotStartTime)) continue;
//       //  Slot is available
//       slots.push({
//         startTime: slotStartTime,
//         endTime: minutesToTime(slotEnd),
//         available: true,
//         slots: 1,
//       });
//     }
//     return slots;
//   }
// }
