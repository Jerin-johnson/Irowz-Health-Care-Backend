import { LabTestsByRecordResult } from "../../../repositories/IMedicalRecordRepository";

export interface IGetMedicalRecordLabTestsUseCase {
  execute(medicalRecordId: string): Promise<LabTestsByRecordResult>;
}
