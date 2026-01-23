import { IDoctorAppointmentRepository } from "../../domain/repositories/IDoctorAppointmentRepository";
import { INotificationRepository } from "../../domain/repositories/notifications/INotificationRepository";

export class NotifyDoctorDelayUseCase {
  constructor(
    private readonly appointmentRepo: IDoctorAppointmentRepository,
    private readonly notificationRepo: INotificationRepository
    // private readonly pushService: IPushNotificationService
  ) {}

  async execute(doctorId: string, delayMinutes: number, reason: string, date: string) {
    // 1️Get all booked patients for today
    const appointments = await this.appointmentRepo.getDoctorAppointmentsForDay(doctorId, date);

    const patients = appointments.filter((a) => a.status === "BOOKED");

    // Notify each patient
    for (const appt of patients) {
      const message = `Doctor is running ${delayMinutes} minutes late. ${reason}`;

      // In-app notification
      await this.notificationRepo.create({
        userId: String(appt.patientId),
        title: "Doctor Delay",
        message,
        type: "DOCTOR_DELAY",
        metadata: {
          doctorId,
          delayMinutes,
        },
      });

      // Push notification
      //   await this.pushService.send({
      //     userId: appt.patientId,
      //     title: "Doctor is running late",
      //     body: message
      //   });
    }
  }
}
