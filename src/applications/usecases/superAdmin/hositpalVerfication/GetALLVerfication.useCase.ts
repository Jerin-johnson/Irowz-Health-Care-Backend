import { tr } from "zod/v4/locales";
import { IHospitalRepository } from "../../../../domain/repositories/IHospital.repo";
import { IHospitalVerificationRepository } from "../../../../domain/repositories/IHospitalVerification.repo";
import { UserRepository } from "../../../../domain/repositories/IUser.repo";

export class GetALLVerficationRequest {
  constructor(
    private HosptialVerficationRepo: IHospitalVerificationRepository
  ) {}

  async execute(status?: string, search?: string) {
    const result = await this.HosptialVerficationRepo.findAllPending();

    return { data: result };
  }
}
