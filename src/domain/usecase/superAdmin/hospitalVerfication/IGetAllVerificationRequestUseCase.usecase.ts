import { HosptialRequestVerficationStatus } from "../../../constants/HosptialRequestVerficationStatus";
import { HospitalVerificationLean } from "../../../repositories/IHospitalVerification.repo";

export interface IGetAllVerificationRequestUseCase {
  execute(input: {
    search?: string;
    status?: HosptialRequestVerficationStatus;
    city?: string;
    page: number;
    limit: number;
  }): Promise<{
    data: HospitalVerificationLean[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>;
}
