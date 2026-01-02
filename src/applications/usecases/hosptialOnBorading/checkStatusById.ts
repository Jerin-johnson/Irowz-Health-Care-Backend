import { IHospitalVerificationRepository } from "../../../domain/repositories/IHospitalVerification.repo";
import { ICheckHospitalVerificationStatusByIdUseCase } from "../../../domain/usecase/hospitalOnBoarding/ICheckHospitalVerificationStatusById.usecase";

export class CheckHospitalVerfcationStatusById implements ICheckHospitalVerificationStatusByIdUseCase {
  constructor(private HosptialVerficatinRepo: IHospitalVerificationRepository) {}

  async execute(id: string) {
    const result = await this.HosptialVerficatinRepo.findByIdStatus(id);
    if (!result) throw new Error("No result");
    return result;
  }
}
