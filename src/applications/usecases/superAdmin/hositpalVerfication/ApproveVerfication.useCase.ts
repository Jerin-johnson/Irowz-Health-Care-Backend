import { tr } from "zod/v4/locales";
import { IHospitalRepository } from "../../../../domain/repositories/IHospital.repo";
import { IHospitalVerificationRepository } from "../../../../domain/repositories/IHospitalVerification.repo";
import { UserRepository } from "../../../../domain/repositories/IUser.repo";

export class ApproveVerficationRequest {
  constructor(
    private HosptialVerficationRepo: IHospitalVerificationRepository,
    private HosptialRepo: IHospitalRepository,
    private userRepo: UserRepository
  ) {}

  async execute(hositpalId: string, adminRemarks?: string) {
    const status =
      await this.HosptialVerficationRepo.findHosptialVerficationStatus(
        hositpalId
      );

    if (status === "APPROVED") throw new Error("The staus is already approved");
    if (status != "PENDING")
      throw new Error(
        "The Invalid action since you alrady perfomed the action"
      );
    const result = await this.HosptialVerficationRepo.updateStatus(
      hositpalId,
      "APPROVED",
      adminRemarks
    );

    if (!result) throw new Error("something went wrong while updatingS");

    await this.userRepo.markVerified(result.userId);

    const hospital = this.HosptialRepo.create({
      isVerified: true,
      verifiedAt: new Date(),
      isActive: true,
      name: result.hospitalName,
      city: result.city,
      licenseDocumentUrl: result.licenseDocumentUrl,
      officialEmail: result.officialEmail,
      registrationNumber: result.registrationNumber,
      phone: result.phone,
      userId: result.userId,
      state: result.state,
    });

    return { message: "Hosptial verfied successfully" };
  }
}
