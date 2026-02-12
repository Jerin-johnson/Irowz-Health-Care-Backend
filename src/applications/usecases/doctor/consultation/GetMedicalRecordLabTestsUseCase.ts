import { IMedicalRecordRepository } from "../../../../domain/repositories/IMedicalRecordRepository";

export class GetMedicalRecordLabTestsUseCase {
  constructor(private medicalRecordRepository: IMedicalRecordRepository) {}

  async execute(medicalRecordId: string) {
    if (!medicalRecordId) {
      throw new Error("Medical record ID is required");
    }

    return this.medicalRecordRepository.getLabTestsByMedicalRecordId(medicalRecordId);
  }
}
