import { IHospitalRepository } from "../../../../domain/repositories/IHospital.repo";

interface GetHospital {
  search?: string;
  isActive?: boolean;
  city?: string;
  page: number;
  limit: number;
}
export class GetALLHosptialLists {
  constructor(private HospitalRepo: IHospitalRepository) {}

  async execute(input: GetHospital) {
    const { page, limit, ...filters } = input;

    const skip = (page - 1) * limit;
    const { data, total, totalHospitals, IsActiveHospitalCount } =
      await this.HospitalRepo.getPaginated(filters, {
        skip,
        limit,
      });

    return {
      data,
      totalHospitals,
      IsActiveHospitalCount,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
