import { Types } from "mongoose";
import { DoctorAvailability } from "../types/DoctorAvailability";

export interface IDoctorAvailabilityRepository {
  findByDoctorId(doctorId: string): Promise<DoctorAvailability | null>;

  create(
    availability: Omit<DoctorAvailability, "id" | "createdAt" | "updatedAt">
  ): Promise<DoctorAvailability>;

  updateByDoctorId(
    doctorId: string,
    availability: Partial<DoctorAvailability>
  ): Promise<DoctorAvailability>;

  getByDoctorIds(doctorIds: Types.ObjectId[]): Promise<
    Map<
      string,
      {
        weeklySchedule: {
          day: string;
          isWorking: boolean;
        }[];
        timezone: string;
      }
    >
  >;

  setDoctorDelay(doctorId: string, delayMinutes: number, reason: string): Promise<void>;

  markDelayEvaluated(doctorId: string): Promise<void>;

  resetDailyDelay(): Promise<void>;
}
