import { IOtpRepository } from "../../../domain/repositories/IOtp.repo";
import { IOtpService } from "../../../domain/services/otp.interface.service";
import { EmailQueueService } from "../../queue/EmailQueueService";
import { IReSendOtpUseCase } from "../../../domain/usecase/auth/IResendOtp.useCase";
import { injectable, inject } from "tsyringe";
import { TOKENS } from "../../../DI/tsyringe/tokens";
import { AuthEvent } from "../../../domain/constants/auth/AuthEvent";

@injectable()
export class ReSendOtpUseCase implements IReSendOtpUseCase {
  constructor(
    @inject(TOKENS.IOtpService)
    private otpService: IOtpService,
    private emailService: EmailQueueService,
    @inject(TOKENS.IOtpRepository)
    private otpRepo: IOtpRepository
  ) {}

  async execute(email: string) {
    const otp = this.otpService.generate();
    const otpHash = await this.otpService.hash(otp);

    await this.otpRepo.save(email, otpHash, 70);

    await this.emailService.sendOtpEmail(email, Number(otp));

    return { message: AuthEvent.OTP_SENT, email };
  }
}
