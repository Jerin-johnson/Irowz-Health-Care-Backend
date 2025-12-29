import { IHospitalSpecialtyRepository } from "../../../../domain/repositories/IHospitalSpecaility.repo";

interface GetSpecialty {
  search?: string;
  isActive?: boolean | null;
  specialty?: string;
  page: number;
  limit: number;
}
export class GetAllSpecialtyUseCase {
  constructor(private HospitalSpeicalityRepo: IHospitalSpecialtyRepository) {}

  async execute(input: GetSpecialty) {
    const { page, limit, ...filters } = input;

    const skip = (page - 1) * limit;
    const { data, total, activeSpecialityCount, totalSpecialityCount } =
      await this.HospitalSpeicalityRepo.getPaginated(filters, {
        skip,
        limit,
      });

    return {
      data,
      activeSpecialityCount,
      totalSpecialityCount,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
