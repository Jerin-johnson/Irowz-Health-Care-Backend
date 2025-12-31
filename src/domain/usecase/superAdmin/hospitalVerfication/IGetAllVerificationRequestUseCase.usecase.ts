import { HosptialRequestVerficationStatus } from "../../../constants/HosptialRequestVerficationStatus";

export interface IGetAllVerificationRequestUseCase {
  execute(input: {
    search?: string;
    status?: HosptialRequestVerficationStatus;
    city?: string;
    page: number;
    limit: number;
  }): Promise<{
    data: any[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>;
}
