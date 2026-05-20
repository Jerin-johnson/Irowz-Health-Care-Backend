import { CreateHospitalVerificationRepository } from "../../repositories/IHospitalVerification.repo";

export interface ISubmitHospitalVerificationRequestUseCase {
  execute(input: CreateHospitalVerificationRepository): Promise<{
    data: {
      userId: string;
      role: string;
      verificationId: string;
      name: string;
      city: string;
      email: string;
      registrationNumber: string;
    };
  }>;
}
