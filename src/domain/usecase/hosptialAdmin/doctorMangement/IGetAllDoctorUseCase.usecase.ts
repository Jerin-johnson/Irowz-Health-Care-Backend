import { PaginatedDoctorResult } from "../../../repositories/IDoctor.repo";

export interface IGetAllDoctorUseCase {
  execute(input: {
    hospitalId: string;
    search?: string;
    isActive?: boolean;
    specialtyId?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: PaginatedDoctorResult[];
    stats: {
      totalDoctorCount: number;
      activeDoctorCount: number;
    };
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>;
}
