import { OtpRepository } from "../../../domain/repositories/IOtp.repo";
import { UserRepository } from "../../../domain/repositories/IUser.repo";
import { IEmailService } from "../../../domain/services/email.interface.service";
import { IOtpService } from "../../../domain/services/otp.interface.service";
import { IPasswordService } from "../../../domain/services/password.interface.service";
import { createUser } from "../../../domain/types/IUser.types";

export class RegisterUserCase {
  constructor(
    private userRepo: UserRepository,
    private passwordService: IPasswordService,
    private otpService: IOtpService,
    private emailService: IEmailService,
    private otpRepo: OtpRepository
  ) {}

  async execute(input: createUser) {
    const existUser = await this.userRepo.findByEmail(input.email);

    if (existUser) throw new Error("User Already exists");
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

    await this.otpRepo.save({
      userId: newUser._id,
      otpHash: otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await this.emailService.sendOtp(newUser.email, otp);

    return { message: "OTP sent" };
  }
}
