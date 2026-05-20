import { PaginatedHospitalSpecialty } from "../../../types/DoctorSpeciality";

export interface IGetAllSpecialtyUseCase {
  execute(input: {
    hospitalId: string;
    search?: string;
    isActive?: boolean | null;
    specialty?: string;
    page: number;
    limit: number;
  }): Promise<{
    data: PaginatedHospitalSpecialty[];
    activeSpecialityCount: number;
    totalSpecialityCount: number;
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>;
}
