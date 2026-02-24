import { IMedicalRecordRepository } from "../../../../domain/repositories/IMedicalRecordRepository";
import { IGetPatientPercriptionWithDoctorInfoUseCase } from "../../../../domain/usecase/patient/medicalRecord/IGetPatientPrescriptionWithDoctorInfoUseCase";

export class GetPatientPercriptionWithDoctorInfoUseCase implements IGetPatientPercriptionWithDoctorInfoUseCase {
  constructor(private readonly _medicalRecordRepository: IMedicalRecordRepository) {}

  async execute(recordId: string) {
    if (!recordId) {
      throw new Error("Medical record id is required");
    }

    const result =
      await this._medicalRecordRepository.findMedicalRecordWithDoctorAndHospital(recordId);

    if (!result) {
      throw new Error("Medical record not found");
    }

    return result;
  }
}
