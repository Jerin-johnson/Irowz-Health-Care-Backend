import { IOtpRepository } from "../../../domain/repositories/IOtp.repo";
import { IUserRepository } from "../../../domain/repositories/IUser.repo";
// import { IEmailService } from "../../../domain/services/email.interface.service";
import { IOtpService } from "../../../domain/services/otp.interface.service";
import { IPasswordService } from "../../../domain/services/password.interface.service";
import { createUser } from "../../../domain/types/IUser.types";
import { EmailQueueService } from "../../queue/EmailQueueService";
import { IRegisterUserUseCase } from "../../../domain/usecase/auth/IRegisterUser.useCase";
import { injectable, inject } from "tsyringe";
import { TOKENS } from "../../../DI/tsyringe/tokens";
import { AuthErrorCode } from "../../../domain/constants/auth/AuthErrorCode";
import { AuthEvent } from "../../../domain/constants/auth/AuthEvent";

@injectable()
export class RegisterUserCase implements IRegisterUserUseCase {
  constructor(
    @inject(TOKENS.IUserRepository)
    private userRepo: IUserRepository,
    @inject(TOKENS.IPasswordService)
    private passwordService: IPasswordService,
    @inject(TOKENS.IOtpService)
    private otpService: IOtpService,
    private emailService: EmailQueueService,
    @inject(TOKENS.IOtpRepository)
    private otpRepo: IOtpRepository
  ) {}

  async execute(input: createUser) {
    const existUser = await this.userRepo.findByEmail(input.email);

    if (existUser) throw new Error(AuthErrorCode.USER_ALREADY_EXISTS);
    const hashPassword = await this.passwordService.hash(input.password);

    const newUser = await this.userRepo.create({
      ...input,
      password: hashPassword,
    });

    if (!newUser) {
      throw new Error("Failed to create user account");
    }

    const otp = this.otpService.generate();
    const otpHash = await this.otpService.hash(otp);

    await this.otpRepo.save(newUser.email, otpHash, 70);

    await this.emailService.sendOtpEmail(newUser.email, Number(otp));

    return {
      message: AuthEvent.OTP_SENT,
      userId: newUser._id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };
  }
}
