import { email } from "zod";
import { OtpRepository } from "../../../domain/repositories/IOtp.repo";

// import { IEmailService } from "../../../domain/services/email.interface.service";
import { IOtpService } from "../../../domain/services/otp.interface.service";

import { EmailQueueService } from "../../queue/EmailQueueService";
import { IReSendOtpUseCase } from "../../../domain/usecase/auth/IResendOtp.useCase";

export class ReSendOtpUseCase implements IReSendOtpUseCase {
  constructor(
    private otpService: IOtpService,
    private emailService: EmailQueueService,
    private otpRepo: OtpRepository
  ) {}

  async execute(email: string) {
    const otp = this.otpService.generate();
    const otpHash = await this.otpService.hash(otp);

    await this.otpRepo.save(email, otpHash, 70);

    await this.emailService.sendOtpEmail(email, Number(otp));

    return { message: "OTP sent", email };
  }
}
