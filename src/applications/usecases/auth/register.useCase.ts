import { OtpRepository } from "../../../domain/repositories/IOtp.repo";
import { UserRepository } from "../../../domain/repositories/IUser.repo";
// import { IEmailService } from "../../../domain/services/email.interface.service";
import { IOtpService } from "../../../domain/services/otp.interface.service";
import { IPasswordService } from "../../../domain/services/password.interface.service";
import { createUser } from "../../../domain/types/IUser.types";
import { EmailQueueService } from "../../queue/EmailQueueService";

export class RegisterUserCase {
  constructor(
    private userRepo: UserRepository,
    private passwordService: IPasswordService,
    private otpService: IOtpService,
    private emailService: EmailQueueService,
    private otpRepo: OtpRepository
  ) {}

  async execute(input: createUser) {
    const existUser = await this.userRepo.findByEmail(input.email);

    if (existUser) throw new Error("User Already exists");
    const hashPassword = await this.passwordService.hash(input.password);

    console.log("the input", input);
    const newUser = await this.userRepo.create({
      ...input,
      password: hashPassword,
    });

    if (!newUser) {
      throw new Error("Failed to create user account");
    }

    const otp = this.otpService.generate();
    const otpHash = await this.otpService.hash(otp);

    await this.otpRepo.save(newUser._id, otpHash, 70);

    await this.emailService.sendOtpEmail(newUser.email, Number(otp));

    return { message: "OTP sent", userId: newUser._id };
  }
}
