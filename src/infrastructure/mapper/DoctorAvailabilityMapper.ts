import { Types } from "mongoose";
import { DoctorAvailability } from "../../domain/types/DoctorAvailability";
import { DoctorAvailabilityDocument } from "../database/mongo/models/DoctorAvailabilityModel";

export class DoctorAvailabilityMapper {
  static toDomain(doc: DoctorAvailabilityDocument): DoctorAvailability {
    return {
      id: (doc._id as Types.ObjectId).toString(),
      doctorId: doc.doctorId.toString(),

      weeklySchedule: doc.weeklySchedule.map((day) => ({
        day: day.day,
        isWorking: day.isWorking,
        workingHours: day.workingHours
          ? {
              start: day.workingHours.start,
              end: day.workingHours.end,
            }
          : undefined,
        breakTime: day.breakTime
          ? {
              start: day.breakTime.start,
              end: day.breakTime.end,
            }
          : undefined,
      })),

      slotDurationMinutes: doc.slotDurationMinutes,
      maxPatientsPerDay: doc.maxPatientsPerDay,

      teleConsultationEnabled: doc.teleConsultationEnabled,
      timezone: doc.timezone,

      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
