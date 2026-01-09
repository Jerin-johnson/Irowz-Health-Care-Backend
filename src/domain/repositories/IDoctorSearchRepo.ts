import {
  DoctorSearchQueryDTO,
  DoctorSearchRawDTO,
} from "../../applications/dtos/patient/doctor.search.Dto";

export interface IDoctorSearchRepository {
  searchDoctors(query: DoctorSearchQueryDTO): Promise<{
    items: DoctorSearchRawDTO[];
    total: number;
  }>;
}
