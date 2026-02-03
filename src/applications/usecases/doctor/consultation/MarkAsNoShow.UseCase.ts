import { DomainEventPublisher } from "../../../../domain/events/event";
import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";

interface IMarkAsNoShowUseCase {
  execute(appointmentId: string, doctorId: string): Promise<{ message: string }>;
}

export class MarkAsNoShowUseCase implements IMarkAsNoShowUseCase {
  constructor(
    private readonly _DoctorAppointmentRepo: IDoctorAppointmentRepository,
    private readonly _eventPublisher: DomainEventPublisher
  ) {}

  async execute(appointmentId: string, doctorId: string) {
    const appointment = await this._DoctorAppointmentRepo.findById(appointmentId);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    if (String(appointment.doctorId) !== doctorId) {
      throw new Error("your are not the doctor...which the patient take the appoinment");
    }

    const maxPriority = await this._DoctorAppointmentRepo.getMaxQueuePriority({
      doctorId: String(appointment.doctorId),
      date: String(appointment.date),
    });

    await this._DoctorAppointmentRepo.markNoShow({
      appointmentId,
      newPriority: maxPriority + 1,
      markedAt: new Date(),
    });

    await this._eventPublisher.publish({
      type: "MARK_NO_SHOW",
      payload: {
        patientId: String(appointment.patientId),
        appointmentId: String(appointment._id),
        newQueuePriority: maxPriority + 1,
      },
    });

    return {
      message: "Marked as no-show and moved to end of queue",
    };
  }
}
