import { MedicalRecord } from "../../../../applications/dtos/doctor/medicalRecord.mapper";

export interface GetMedicalHistoryPatientInput {
  patientId: string;
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  diagnosisKeyword?: string;
}

export interface GetMedicalHistoryPatientResponse {
  data: MedicalRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface IGetMedicalHistoryPatientUseCase {
  execute(input: GetMedicalHistoryPatientInput): Promise<GetMedicalHistoryPatientResponse>;
}
