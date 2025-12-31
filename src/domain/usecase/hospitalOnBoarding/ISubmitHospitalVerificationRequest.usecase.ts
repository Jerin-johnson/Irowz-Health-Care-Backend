import { CreateHospitalVerificationRepository } from "../../repositories/IHospitalVerification.repo";

export interface ISubmitHospitalVerificationRequestUseCase {
  execute(input: CreateHospitalVerificationRepository): Promise<{
    data: {
      userId: any;
      role: string;
      verificationId: any;
      name: string;
      city: string;
      email: string;
      registrationNumber: string;
    };
  }>;
}
