// src/domain/usecases/doctor/ConfirmDoctorAvailabilityChange.types.ts

import { WeeklySchedule } from "../../../types/WeeklySchdule.types";

export interface ConfirmDoctorAvailabilityChangeInput {
  weeklySchedule: WeeklySchedule[];
  slotDurationMinutes: number;
  maxPatientsPerDay: number;
  teleConsultationEnabled: boolean;
  timezone: string;
}

export interface ConfirmDoctorAvailabilityChangeResult {
  affectedAppointmentCount: number;
}

export interface IConfirmDoctorAvailabilityChangeUseCase {
  execute(
    doctorId: string,
    input: ConfirmDoctorAvailabilityChangeInput
  ): Promise<ConfirmDoctorAvailabilityChangeResult>;
}
