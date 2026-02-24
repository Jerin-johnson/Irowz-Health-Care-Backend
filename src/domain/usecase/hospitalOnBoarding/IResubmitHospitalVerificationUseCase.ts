import { CreateHospitalVerificationRepository } from "../../repositories/IHospitalVerification.repo";

export interface IResubmitHospitalVerificationUseCase {
  execute(
    verificationId: string,
    input: CreateHospitalVerificationRepository
  ): Promise<{
    message: string;
    data: {
      city: string;
    };
  }>;
}
