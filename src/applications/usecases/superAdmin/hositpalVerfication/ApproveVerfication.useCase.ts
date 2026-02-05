import { IHospitalRepository } from "../../../../domain/repositories/IHospital.repo";
import { IHospitalSubscriptionRepository } from "../../../../domain/repositories/IHospitalSubscriptionRepository";
import { IHospitalVerificationRepository } from "../../../../domain/repositories/IHospitalVerification.repo";
import { ISubscriptionPlanRepository } from "../../../../domain/repositories/ISubscriptionPlanRepository";
import { IUserRepository } from "../../../../domain/repositories/IUser.repo";
import { IApproveVerificationRequestUseCase } from "../../../../domain/usecase/superAdmin/hospitalVerfication/IApproveVerificationRequestUseCase.usecase";

export class ApproveVerficationRequest implements IApproveVerificationRequestUseCase {
  constructor(
    private HosptialVerficationRepo: IHospitalVerificationRepository,
    private HosptialRepo: IHospitalRepository,
    private userRepo: IUserRepository,
    private planRepo: ISubscriptionPlanRepository,
    private hospitalSubRepo: IHospitalSubscriptionRepository
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
        latitude: Number(hosptialVerficationInfo.latitude) || 0,
        longitude: Number(hosptialVerficationInfo.longitude) || 0,
        pincode: hosptialVerficationInfo.pincode,
        address: hosptialVerficationInfo.hospitalAddress,
        licenseDocumentKey: hosptialVerficationInfo.licenseDocumentKey,
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
        latitude: Number(hosptialVerficationInfo.latitude) || 0,
        longitude: Number(hosptialVerficationInfo.longitude) || 0,
        address: hosptialVerficationInfo.hospitalAddress,
        licenseDocumentKey: hosptialVerficationInfo.licenseDocumentKey,
        isVerified: true,
        verifiedAt: new Date(),
        isActive: true,
      });
    }

    await this.userRepo.markVerified(hosptialVerficationInfo.userId);

    await this.HosptialVerficationRepo.updateStatus(hospitalId, "APPROVED", adminRemarks);

    //subscription plan assignment

    const freeTrial = await this.planRepo.findByName("Free Trial");

    if (!freeTrial) {
      throw new Error("Free Trial plan missing in system");
    }

    const activeSub = await this.hospitalSubRepo.findActiveByHospital(
      hosptialVerficationInfo.userId
    );

    if (!activeSub) {
      const startDate = new Date();

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + freeTrial.durationInDays);

      await this.hospitalSubRepo.create({
        hospitalId: hosptialVerficationInfo.userId,
        planId: freeTrial._id,

        doctorLimitSnapshot: freeTrial.doctorLimit,
        priceSnapshot: freeTrial.price,
        durationSnapshot: freeTrial.durationInDays,

        startDate,
        endDate,
        status: "ACTIVE",
      });
    }

    return { message: "Hospital verified successfully" };
  }
}
