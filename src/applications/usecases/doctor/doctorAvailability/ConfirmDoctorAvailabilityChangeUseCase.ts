import { DomainEventPublisher } from "../../../../domain/events/event";
import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { IDoctorAvailabilityRepository } from "../../../../domain/repositories/IDoctorAvailabilityRepository";
import { INotificationRepository } from "../../../../domain/repositories/notifications/INotificationRepository";
import { hasAvailabilityConflict } from "../../../../domain/services/checkAvailabilityConflict";
import { WeeklySchedule } from "../../../../domain/types/WeeklySchdule.types";
import { IConfirmDoctorAvailabilityChangeUseCase } from "../../../../domain/usecase/doctor/doctorAvailbility/IConfirmDoctorAvailabilityChangeUseCase";

export class ConfirmDoctorAvailabilityChangeUseCase implements IConfirmDoctorAvailabilityChangeUseCase {
  constructor(
    private readonly availabilityRepo: IDoctorAvailabilityRepository,
    private readonly appointmentRepo: IDoctorAppointmentRepository,
    private readonly notificationRepo: INotificationRepository,
    private readonly eventPublisher: DomainEventPublisher
  ) {}

  async execute(
    doctorId: string,
    input: {
      weeklySchedule: WeeklySchedule[];
      slotDurationMinutes: number;
      maxPatientsPerDay: number;
      teleConsultationEnabled: boolean;
      timezone: string;
    }
  ) {
    //  Update availability
    await this.availabilityRepo.updateByDoctorId(doctorId, {
      ...input,
      updatedAt: new Date(),
    });

    // 2️ Fetch future appointments
    const appointments = await this.appointmentRepo.findFutureBookedAppointments(doctorId);

    // Detect conflicts
    const affectedAppointments = appointments.filter((appt) =>
      hasAvailabilityConflict(appt, input.weeklySchedule)
    );

    if (affectedAppointments.length === 0) {
      return { affectedAppointmentCount: 0 };
    }

    const appointmentIds = affectedAppointments.map((a) => a._id.toString());
    const patientIds = affectedAppointments.map((a) => a.patientId.toString());
    const dateSet = [...new Set(affectedAppointments.map((a) => a.date))];

    // Mark appointments
    await this.appointmentRepo.markAvailabilityAffected(appointmentIds);

    //  notification creationn
    for (const appt of affectedAppointments) {
      await this.notificationRepo.create({
        userId: String(appt.patientId),
        type: "DOCTOR_AVAILABILITY_CHANGED",
        title: "Appointment requires your action",
        message: `Your appointment on ${appt.date} at ${appt.startTime} is affected due to a change in doctor availability.`,
        metadata: {
          appointmentId: String(appt._id),
          doctorId,
        },
      });
    }

    //  Publish realtime event
    await this.eventPublisher.publish({
      type: "DOCTOR_AVAILABILITY_CHANGED",
      payload: {
        doctorId,
        appointmentIds,
        patientIds,
        dateSet,
      },
    });

    return {
      affectedAppointmentCount: affectedAppointments.length,
    };
  }
}
