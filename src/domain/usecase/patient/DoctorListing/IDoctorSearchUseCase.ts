import {
  DoctorSearchQueryDTO,
  DoctorSearchResponseDTO,
} from "../../../../applications/dtos/patient/doctor.search.Dto";

export interface IDoctorSearchUseCase {
  execute(query: DoctorSearchQueryDTO): Promise<{
    items: DoctorSearchResponseDTO[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>;
}
