import { DoctorAppointmentDocument } from "../../infrastructure/database/mongo/models/DoctorAppointmentModel";
import { WeeklySchedule } from "../types/WeeklySchdule.types";

const DAY_MAP: Record<number, WeeklySchedule["day"]> = {
  0: "SUN",
  1: "MON",
  2: "TUE",
  3: "WED",
  4: "THU",
  5: "FRI",
  6: "SAT",
};

export function hasAvailabilityConflict(
  appointment: DoctorAppointmentDocument,
  weeklySchedule: WeeklySchedule[]
): boolean {
  const dayKey = DAY_MAP[new Date(appointment.date).getDay()];
  const dayRule = weeklySchedule.find((d) => d.day === dayKey);

  if (!dayRule || !dayRule.isWorking) {
    return true;
  }

  if (!dayRule.workingHours) {
    return true;
  }

  const { start, end } = dayRule.workingHours;

  if (appointment.startTime < start || appointment.endTime > end) {
    return true;
  }

  if (dayRule.breakTime) {
    const { start: bStart, end: bEnd } = dayRule.breakTime;

    const overlapsBreak = appointment.startTime < bEnd && appointment.endTime > bStart;

    if (overlapsBreak) {
      return true;
    }
  }

  return false;
}
