import { DomainEventPublisher } from "../../../../domain/events/event";
import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { IMedicalRecordRepository } from "../../../../domain/repositories/IMedicalRecordRepository";
import { IDoctorAvailabilityRepository } from "../../../../domain/repositories/IDoctorAvailabilityRepository";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getCurrentISTMinutes, timeToMinutes } from "../../../../domain/utils/time.utils";

dayjs.extend(utc);
dayjs.extend(timezone);

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

    // if (appointment.status !== "BOOKED" || appointment.status !== "NO_SHOW") {
    //   throw new Error("Only BOOKED appointments can be started");
    // }

    const active = await this._appointmentRepo.findActiveConsultation(
      String(appointment.doctorId),
      String(appointment.date)
    );

    if (active) {
      throw new Error("Doctor already has an active consultation");
    }

    const availability = await this._availabilityRepo.findByDoctorId(String(appointment.doctorId));

    const delayAlreadyEvaluated = Boolean(
      availability?.doctorDelayedAt && this.isSameDay(availability.doctorDelayedAt, new Date())
    );

    console.log("The Doctor delay evalution ", delayAlreadyEvaluated);

    let delayApplied = false;
    let delayMinutes = 0;

    if (!delayAlreadyEvaluated) {
      console.log("does this called actually");

      const scheduledMinutes = timeToMinutes(appointment.startTime);
      const nowMinutes = getCurrentISTMinutes();

      delayMinutes = nowMinutes - scheduledMinutes;

      console.log("Scheduled minutes:", scheduledMinutes);
      console.log("Current IST minutes:", nowMinutes);
      console.log("Delay minutes:", delayMinutes);

      if (delayMinutes < 0) delayMinutes = 0;

      if (delayMinutes > DELAY_THRESHOLD_MINUTES) {
        await this._availabilityRepo.setDoctorDelay(
          String(appointment.doctorId),
          delayMinutes,
          "Doctor started late"
        );

        delayApplied = true;
      } else {
        // Mark delay nevverer  caluculated today today
        console.log("to know which is called");
        await this._availabilityRepo.markDelayEvaluated(String(appointment.doctorId));
      }
    }

    const updated = await this._appointmentRepo.startConsultation(appointmentId);

    console.log("the doctor updated", updated);

    let medicalRecord = await this._medicalRecordRepo.findByAppointmentId(String(updated._id));

    if (!medicalRecord) {
      medicalRecord = await this._medicalRecordRepo.createDraft({
        appointmentId: String(updated._id),
        patientId: String(updated.patientId),
        doctorId: String(updated.doctorId),
        hospitalId: String(updated.hospitalId),
        visitType: updated.visitType,
        visitDate: new Date(),
      });
    }
    const nextPatientIds = await this._appointmentRepo.getNextPatients(
      String(updated.doctorId),
      String(updated.date),
      1
    );

    console.log("The next patient are", nextPatientIds);

    await this._eventPublisher.publish({
      type: "CONSULTATION_STARTED",
      payload: {
        appointmentId: String(updated._id),
        currentPatientId: String(updated.patientId),
        nextPatientIds,
        visitType: updated.visitType,
        doctorId: updated.doctorId,
      },
    });

    let affectedPatientIds: string[] = [];

    if (delayApplied) {
      const bookedAppointments = await this._appointmentRepo.getDoctorAppointmentsForDay(
        String(updated.doctorId),
        String(updated.date)
      );

      affectedPatientIds = bookedAppointments
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
        patientIds: affectedPatientIds,
      },
    });

    return {
      appointmentId: updated._id.toString(),
      status: updated.status,
      startedAt: updated.startedAt,
      patientId: updated.patientId,
      patientName: updated.patientSnapshot.firstName,
      medicalRecordId: medicalRecord._id,
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
