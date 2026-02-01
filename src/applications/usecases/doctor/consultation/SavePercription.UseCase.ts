import { IMedicalRecordRepository } from "../../../../domain/repositories/IMedicalRecordRepository";
import { UpdateMedicalRecordInput } from "../../../dtos/doctor/PercritpitonDto";

export class UpdateMedicalRecordPercriptionUseCase {
  constructor(private readonly _MedicalRecordRepo: IMedicalRecordRepository) {}

  async execute(input: UpdateMedicalRecordInput) {
    const medicalRecord = await this._MedicalRecordRepo.findByAppointmentId(input.appointmentId);

    if (!medicalRecord) {
      throw new Error("Medical record not found");
    }

    if (medicalRecord.status === "LOCKED") {
      throw new Error("Medical record is locked and cannot be modified");
    }

    if (input.primaryDiagnosis) {
      medicalRecord.diagnosisSummary = input.primaryDiagnosis;
    }

    if (input.clinicalObservations) {
      medicalRecord.clinicalObservations = input.clinicalObservations;
    }

    if (input.medications) {
      medicalRecord.prescriptions = input.medications.map((med) => ({
        medicineName: med.name,
        dosage: med.dosage,
        frequency: med.dosageUnit,
        duration: `${med.duration} ${med.durationUnit}`,
        instructions: med.instructions,
      }));
    }

    if (input.followUpDate) {
      medicalRecord.followUpDate = new Date(input.followUpDate);
    }

    const updatedMedicalRecord = await this._MedicalRecordRepo.save(medicalRecord);

    console.log(updatedMedicalRecord);
    return { message: "Percription save successfully" };
  }
}
