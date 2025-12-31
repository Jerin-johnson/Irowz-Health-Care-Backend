import { IDoctorRepository } from "../../../../domain/repositories/IDoctor.repo";

interface GetAllDoctorInput {
  hospitalId: string;
  search?: string;
  isActive?: boolean;
  specialtyId?: string;
  page?: number;
  limit?: number;
}

export class GetAllDoctorUseCase {
  constructor(private readonly doctorRepo: IDoctorRepository) {}

  async execute(input: GetAllDoctorInput) {
    const {
      hospitalId,
      search,
      isActive,
      specialtyId,
      page = 1,
      limit = 10,
    } = input;

    const skip = (page - 1) * limit;

    const { data, total, activeDoctorCount, totalDoctorCount } =
      await this.doctorRepo.getPaginated(
        {
          hospitalId,
          search,
          isActive,
          specialtyId,
        },
        {
          skip,
          limit,
        }
      );

    return {
      data,
      stats: {
        totalDoctorCount,
        activeDoctorCount,
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
