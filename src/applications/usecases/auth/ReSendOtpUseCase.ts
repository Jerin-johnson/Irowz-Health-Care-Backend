import { email } from "zod";
import { OtpRepository } from "../../../domain/repositories/IOtp.repo";
import { UserRepository } from "../../../domain/repositories/IUser.repo";
// import { IEmailService } from "../../../domain/services/email.interface.service";
import { IOtpService } from "../../../domain/services/otp.interface.service";
import { IPasswordService } from "../../../domain/services/password.interface.service";
import { createUser } from "../../../domain/types/IUser.types";
import { EmailQueueService } from "../../queue/EmailQueueService";

export class ReSendOtpUseCase {
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
