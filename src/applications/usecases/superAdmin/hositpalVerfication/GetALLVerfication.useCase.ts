import { IHospitalVerificationRepository } from "../../../../domain/repositories/IHospitalVerification.repo";

import { HosptialRequestVerficationStatus } from "../../../../domain/constants/HosptialRequestVerficationStatus";
import { IGetAllVerificationRequestUseCase } from "../../../../domain/usecase/superAdmin/hospitalVerfication/IGetAllVerificationRequestUseCase.usecase";

interface GetHospitalRequestsInput {
  search?: string;
  status?: HosptialRequestVerficationStatus;
  city?: string;
  page: number;
  limit: number;
}
export class GetALLVerficationRequest implements IGetAllVerificationRequestUseCase {
  constructor(
    private HosptialVerficationRepo: IHospitalVerificationRepository
  ) {}

  async execute(input: GetHospitalRequestsInput) {
    const { page, limit, ...filters } = input;

    const skip = (page - 1) * limit;

    const { data, total } = await this.HosptialVerficationRepo.getPaginated(
      filters,
      { skip, limit }
    );

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
