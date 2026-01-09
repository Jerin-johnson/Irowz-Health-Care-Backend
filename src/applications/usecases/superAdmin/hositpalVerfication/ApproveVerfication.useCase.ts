import { IHospitalRepository } from "../../../../domain/repositories/IHospital.repo";
import { IHospitalVerificationRepository } from "../../../../domain/repositories/IHospitalVerification.repo";
import { IUserRepository } from "../../../../domain/repositories/IUser.repo";
import { IApproveVerificationRequestUseCase } from "../../../../domain/usecase/superAdmin/hospitalVerfication/IApproveVerificationRequestUseCase.usecase";

export class ApproveVerficationRequest implements IApproveVerificationRequestUseCase {
  constructor(
    private HosptialVerficationRepo: IHospitalVerificationRepository,
    private HosptialRepo: IHospitalRepository,
    private userRepo: IUserRepository
  ) {}

  async execute(hospitalId: string, adminRemarks?: string) {
    const hosptialVerficationInfo = await this.HosptialVerficationRepo.findById(hospitalId);

    if (!hosptialVerficationInfo) {
      throw new Error("such thing is not founded ");
    }

    if (hosptialVerficationInfo?.status === "APPROVED") {
      throw new Error("Hospital is already approved");
    }

    if (hosptialVerficationInfo?.status !== "PENDING") {
      throw new Error("Invalid action for current verification status");
    }

    const existingHospital = await this.HosptialRepo.findByUserId(hosptialVerficationInfo.userId);

    if (existingHospital) {
      await this.HosptialRepo.update(hosptialVerficationInfo.userId, {
        isVerified: true,
        verifiedAt: new Date(),
        isActive: true,
        city: hosptialVerficationInfo.city,
        state: hosptialVerficationInfo.state,
        latitude: Number(hosptialVerficationInfo.latitude),
        longitude: Number(hosptialVerficationInfo.longitude),
        pincode: hosptialVerficationInfo.pincode,
        address: hosptialVerficationInfo.hospitalAddress,
        licenseDocumentUrl: hosptialVerficationInfo.licenseDocumentUrl,
      });
    } else {
      await this.HosptialRepo.create({
        userId: hosptialVerficationInfo.userId,
        name: hosptialVerficationInfo.hospitalName,
        registrationNumber: hosptialVerficationInfo.registrationNumber,
        officialEmail: hosptialVerficationInfo.officialEmail,
        phone: hosptialVerficationInfo.phone,
        city: hosptialVerficationInfo.city,
        state: hosptialVerficationInfo.state,
        latitude: Number(hosptialVerficationInfo.latitude),
        longitude: Number(hosptialVerficationInfo.longitude),
        address: hosptialVerficationInfo.hospitalAddress,
        licenseDocumentUrl: hosptialVerficationInfo.licenseDocumentUrl,
        isVerified: true,
        verifiedAt: new Date(),
        isActive: true,
      });
    }

    await this.userRepo.markVerified(hosptialVerficationInfo.userId);

    await this.HosptialVerficationRepo.updateStatus(hospitalId, "APPROVED", adminRemarks);

    return { message: "Hospital verified successfully" };
  }
}
