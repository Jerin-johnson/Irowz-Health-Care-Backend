import {
  CreateHospitalVerificationRepository,
  IHospitalVerificationRepository,
} from "../../../domain/repositories/IHospitalVerification.repo";
import { IUserRepository } from "../../../domain/repositories/IUser.repo";

export class ResubmitHospitalVerificationUseCase {
  constructor(
    private userRepo: IUserRepository,
    private hospitalVerificationRepo: IHospitalVerificationRepository
  ) {}

  async execute(userId: string, input: CreateHospitalVerificationRepository) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const existing = await this.hospitalVerificationRepo.findPendingByUserId(userId);

    if (!existing) throw new Error("No record found on submission");

    if (existing.status === "PENDING") {
      throw new Error("Verification already under review");
    }

    if (existing.status === "APPROVED") {
      throw new Error("Hospital already verified");
    }

    await this.hospitalVerificationRepo.resumbit(existing._id as string, {
      ...input,
      status: "PENDING",
      adminRemarks: undefined,
      reviewedAt: undefined,
      updatedAt: new Date(),
    });

    return { message: "Verification resubmitted" };
  }
}
