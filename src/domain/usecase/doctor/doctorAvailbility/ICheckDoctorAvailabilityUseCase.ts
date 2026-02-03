import { AvailabilityCheckResult } from "../../../../applications/dtos/doctor/AvailbiltyResult";
import { WeeklySchedule } from "../../../types/WeeklySchdule.types";

export interface ICheckDoctorAvailabilityUseCase {
  execute(doctorId: string, weeklySchedule: WeeklySchedule[]): Promise<AvailabilityCheckResult>;
}
