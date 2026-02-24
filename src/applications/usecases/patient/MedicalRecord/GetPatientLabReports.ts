import { IMedicalRecordRepository } from "../../../../domain/repositories/IMedicalRecordRepository";
import { IGetPatientLabTestsUseCase } from "../../../../domain/usecase/patient/medicalRecord/IGetPatientLabTestsUseCase";

export class GetPatientLabTestsUseCase implements IGetPatientLabTestsUseCase {
  constructor(private medicalRecordRepository: IMedicalRecordRepository) {}

  async execute(medicalRecordId: string) {
    if (!medicalRecordId) {
      throw new Error("Medical record ID is required");
    }

    return this.medicalRecordRepository.getLabTestsByMedicalRecordId(medicalRecordId);
  }
}
