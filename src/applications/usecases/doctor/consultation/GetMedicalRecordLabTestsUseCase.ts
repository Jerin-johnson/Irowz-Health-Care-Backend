import { IMedicalRecordRepository } from "../../../../domain/repositories/IMedicalRecordRepository";
import { IGetMedicalRecordLabTestsUseCase } from "../../../../domain/usecase/doctor/consultation/IGetMedicalRecordLabTestsUseCase";

export class GetMedicalRecordLabTestsUseCase implements IGetMedicalRecordLabTestsUseCase {
  constructor(private medicalRecordRepository: IMedicalRecordRepository) {}

  async execute(medicalRecordId: string) {
    if (!medicalRecordId) {
      throw new Error("Medical record ID is required");
    }

    return this.medicalRecordRepository.getLabTestsByMedicalRecordId(medicalRecordId);
  }
}
