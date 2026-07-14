import { Hospital } from "../../../repositories/IHospital.repo";

export interface IGetAllHospitalListsUseCase {
  execute(input: {
    search?: string;
    isActive?: boolean;
    city?: string;
    page: number;
    limit: number;
  }): Promise<{
    data: Hospital[];
    totalHospitals: number;
    IsActiveHospitalCount: number;
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>;
}
