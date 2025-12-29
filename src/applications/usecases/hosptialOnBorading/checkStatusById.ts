import { IHospitalVerificationRepository } from "../../../domain/repositories/IHospitalVerification.repo";

export class CheckHospitalVerfcationStatusById {
  constructor(
    private HosptialVerficatinRepo: IHospitalVerificationRepository
  ) {}

  async execute(id: string) {
    const result = await this.HosptialVerficatinRepo.findByIdStatus(id);
    if (!result) throw new Error("No result");
    return result;
  }
}
