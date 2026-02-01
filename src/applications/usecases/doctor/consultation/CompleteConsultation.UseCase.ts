import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { IMedicalRecordRepository } from "../../../../domain/repositories/IMedicalRecordRepository";

export class CompleteConsultationUseCase {
  constructor(
    private readonly _DoctorAppointmentRepo: IDoctorAppointmentRepository,
    private readonly _MedicalRecordRepo: IMedicalRecordRepository
  ) {}

  async execute(appointmentId: string, doctorId: string) {
    const appointment = await this._DoctorAppointmentRepo.findById(appointmentId);
    if (!appointment) throw new Error("The doctor appointment is not found");
    if (appointment.status === "COMPLETED") {
      throw new Error("Consultation already completed");
    }

    if (String(appointment.doctorId) !== doctorId) {
      throw new Error("Unauthorized doctor");
    }

    const medicalRecord = await this._MedicalRecordRepo.findByAppointmentId(appointmentId);

    if (!medicalRecord) {
      throw new Error("Medical record not found");
    }

    if (!medicalRecord.observationNotes) {
      throw new Error("observation note is mandotory...please add that");
    }

    if (!medicalRecord.diagnosisSummary) {
      throw new Error("primary diagnosis is required ...please add that");
    }

    await this._MedicalRecordRepo.lockRecord(String(medicalRecord._id));
    await this._DoctorAppointmentRepo.markCompleted(appointmentId, new Date());

    return {
      message: "Consultation completed successfully",
    };
  }
}
