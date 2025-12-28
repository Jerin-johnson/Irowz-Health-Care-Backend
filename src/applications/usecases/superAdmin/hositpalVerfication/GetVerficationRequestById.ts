import { IHospitalVerificationRepository } from "../../../../domain/repositories/IHospitalVerification.repo";

export class GetVerficationRequestById {
  constructor(
    private HosptialVerficationRepo: IHospitalVerificationRepository
  ) {}

  async execute(hosptialVerficationId: string) {
    const result = await this.HosptialVerficationRepo.findById(
      hosptialVerficationId
    );
    return result;
  }
}
