import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { hasAvailabilityConflict } from "../../../../domain/services/checkAvailabilityConflict";
import { WeeklySchedule } from "../../../../domain/types/WeeklySchdule.types";
import { ICheckDoctorAvailabilityUseCase } from "../../../../domain/usecase/doctor/doctorAvailbility/ICheckDoctorAvailabilityUseCase";
import {
  AffectedAppointmentInfo,
  AvailabilityCheckResult,
} from "../../../dtos/doctor/AvailbiltyResult";

export class CheckDoctorAvailabilityUseCase implements ICheckDoctorAvailabilityUseCase {
  constructor(private readonly appointmentRepo: IDoctorAppointmentRepository) {}

  async execute(
    doctorId: string,
    weeklySchedule: WeeklySchedule[]
  ): Promise<AvailabilityCheckResult> {
    const appointments = await this.appointmentRepo.findFutureBookedAppointments(doctorId);

    console.log("the future appointments are", appointments, weeklySchedule);

    const affectedAppointments: AffectedAppointmentInfo[] = [];

    for (const appointment of appointments) {
      const isConflicting = hasAvailabilityConflict(appointment, weeklySchedule);

      if (isConflicting) {
        affectedAppointments.push({
          appointmentId: appointment._id.toString(),
          date: appointment.date,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          patientName: `${appointment.patientSnapshot.firstName} ${appointment.patientSnapshot.lastName}`,
        });
      }
    }

    return {
      canProceed: affectedAppointments.length === 0,
      affectedAppointmentCount: affectedAppointments.length,
      affectedAppointments,
    };
  }
}
