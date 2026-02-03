import { MedicalRecord } from "../../../../applications/dtos/doctor/medicalRecord.mapper";

export interface GetMedicalHistoryInput {
  appointmentId: string;
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  diagnosisKeyword?: string;
}

export interface MedicalHistoryPagination {
  total: number;
  page: number;
  limit: number;
}

export interface GetMedicalHistoryResult {
  data: MedicalRecord[];
  pagination: MedicalHistoryPagination;
}

export interface IGetMedicalHistoryUseCase {
  execute(input: GetMedicalHistoryInput): Promise<GetMedicalHistoryResult>;
}
