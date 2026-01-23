import { DomainEventPublisher } from "../../../../domain/events/event";
import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { IMedicalRecordRepository } from "../../../../domain/repositories/IMedicalRecordRepository";
import { IDoctorAvailabilityRepository } from "../../../../domain/repositories/IDoctorAvailabilityRepository";

const DELAY_THRESHOLD_MINUTES = 5;

export class StartConsultationUseCase {
  constructor(
    private readonly _appointmentRepo: IDoctorAppointmentRepository,
    private readonly _availabilityRepo: IDoctorAvailabilityRepository,
    private readonly _medicalRecordRepo: IMedicalRecordRepository,
    private readonly _eventPublisher: DomainEventPublisher
  ) {}

  async execute(appointmentId: string) {
    const appointment = await this._appointmentRepo.findById(appointmentId);
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.status !== "BOOKED") {
      throw new Error("Only BOOKED appointments can be started");
    }

    const active = await this._appointmentRepo.findActiveConsultation(
      String(appointment.doctorId),
      String(appointment.date)
    );

    if (active) {
      throw new Error("Doctor already has an active consultation");
    }

    const availability = await this._availabilityRepo.findByDoctorId(String(appointment.doctorId));

    const delayAlreadyEvaluated =
      availability?.doctorDelayedAt && this.isSameDay(availability.doctorDelayedAt, new Date());

    let delayApplied = false;
    let delayMinutes = 0;

    if (!delayAlreadyEvaluated) {
      const now = new Date();

      const scheduledStart = new Date(`${appointment.date}T${appointment.startTime}:00`);

      delayMinutes = Math.floor((now.getTime() - scheduledStart.getTime()) / 60000);

      if (delayMinutes < 0) delayMinutes = 0;

      if (delayMinutes > DELAY_THRESHOLD_MINUTES) {
        await this._availabilityRepo.setDoctorDelay(
          String(appointment.doctorId),
          delayMinutes,
          "Doctor started late"
        );

        delayApplied = true;
      } else {
        // Mark delay as evaluated so we don't calculate again today
        await this._availabilityRepo.markDelayEvaluated(String(appointment.doctorId));
      }
    }

    const updated = await this._appointmentRepo.startConsultation(appointmentId);

    await this._medicalRecordRepo.createDraft({
      appointmentId: String(updated._id),
      patientId: String(updated.patientId),
      doctorId: String(updated.doctorId),
      visitType: updated.visitType,
      visitDate: new Date(),
    });

    const nextPatientIds = await this._appointmentRepo.getNextPatients(
      String(updated.doctorId),
      String(updated.date),
      1
    );

    await this._eventPublisher.publish({
      type: "CONSULTATION_STARTED",
      payload: {
        currentPatientId: String(updated.patientId),
        nextPatientIds,
      },
    });

    if (delayApplied) {
      const bookedAppointments = await this._appointmentRepo.getDoctorAppointmentsForDay(
        String(updated.doctorId),
        String(updated.date)
      );

      const affectedPatientIds = bookedAppointments
        .filter((a) => a.status === "BOOKED")
        .map((a) => String(a.patientId));

      await this._eventPublisher.publish({
        type: "DOCTOR_DELAYED",
        payload: {
          doctorId: String(updated.doctorId),
          date: String(updated.date),
          delayMinutes,
          reason: "Doctor started late",
          patientIds: affectedPatientIds,
        },
      });
    }

    await this._eventPublisher.publish({
      type: "QUEUE_UPDATED",
      payload: {
        doctorId: String(updated.doctorId),
        date: String(updated.date),
      },
    });

    return {
      appointmentId: updated._id.toString(),
      status: updated.status,
      startedAt: updated.startedAt,
    };
  }

  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }
}
