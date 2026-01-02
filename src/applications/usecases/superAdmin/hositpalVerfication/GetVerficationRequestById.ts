import { IHospitalVerificationRepository } from "../../../../domain/repositories/IHospitalVerification.repo";
import { IGetVerificationRequestByIdUseCase } from "../../../../domain/usecase/superAdmin/hospitalVerfication/IGetVerificationRequestByIdUseCase.usecase";

export class GetVerficationRequestById implements IGetVerificationRequestByIdUseCase {
  constructor(private HosptialVerficationRepo: IHospitalVerificationRepository) {}

  async execute(hosptialVerficationId: string) {
    const result = await this.HosptialVerficationRepo.findById(hosptialVerficationId);
    return result;
  }
}
