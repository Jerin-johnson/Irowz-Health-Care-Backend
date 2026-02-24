import { LabTestsByRecordResult } from "../../../repositories/IMedicalRecordRepository";

export interface IGetPatientLabTestsUseCase {
  execute(medicalRecordId: string): Promise<LabTestsByRecordResult>;
}
