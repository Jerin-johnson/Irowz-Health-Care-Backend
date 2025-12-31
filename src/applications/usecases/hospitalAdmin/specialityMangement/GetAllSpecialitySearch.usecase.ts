import { IHospitalSpecialtyRepository } from "../../../../domain/repositories/IHospitalSpecaility.repo";
import { IGetAllSpecialtyUseCase } from "../../../../domain/usecase/hosptialAdmin/specialityMangement/IGetAllSpecialtyUseCase.usecase";

interface GetSpecialty {
  hospitalId: string;
  search?: string;
  isActive?: boolean | null;
  specialty?: string;
  page: number;
  limit: number;
}
export class GetAllSpecialtyUseCase implements IGetAllSpecialtyUseCase {
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
