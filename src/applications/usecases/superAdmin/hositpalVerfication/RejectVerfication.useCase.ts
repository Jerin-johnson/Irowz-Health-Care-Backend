import { IHospitalRepository } from "../../../../domain/repositories/IHospital.repo";
import { IHospitalVerificationRepository } from "../../../../domain/repositories/IHospitalVerification.repo";
import { IRejectVerificationRequestUseCase } from "../../../../domain/usecase/superAdmin/hospitalVerfication/IRejectVerificationRequestUseCase.usecase";

export class RejectVerficationRequest implements IRejectVerificationRequestUseCase {
  constructor(
    private HosptialVerficationRepo: IHospitalVerificationRepository
  ) {}

  async execute(hositpalId: string, adminRemarks?: string) {
    const status =
      await this.HosptialVerficationRepo.findHosptialVerficationStatus(
        hositpalId
      );
    if (!status) throw new Error("Invalid operation");
    if (status !== "PENDING")
      throw new Error(
        "Your already reviewed this record and updated the result"
      );
    const result = await this.HosptialVerficationRepo.updateStatus(
      hositpalId,
      "REJECTED",
      adminRemarks
    );

    return { message: "Application rejected successfully" };
  }
}
