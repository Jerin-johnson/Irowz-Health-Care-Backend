import { TOKENS } from "../../../DI/tsyringe/tokens";
import { IOtpRepository } from "../../../domain/repositories/IOtp.repo";
import { IUserRepository } from "../../../domain/repositories/IUser.repo";
import { ITokenService } from "../../../domain/services/jwt.interface.service";
import { IOtpService } from "../../../domain/services/otp.interface.service";
import { IVerifyOtpUseCase } from "../../../domain/usecase/auth/IVerifyOtpUseCase.usecase";
import { injectable, inject } from "tsyringe";

@injectable()
export class VerfiyOtpUseCase implements IVerifyOtpUseCase {
  constructor(
    @inject(TOKENS.IUserRepository)
    private UserRepo: IUserRepository,
    @inject(TOKENS.IOtpRepository)
    private OtpRepo: IOtpRepository,
    @inject(TOKENS.IOtpService)
    private OtpService: IOtpService,
    @inject(TOKENS.ITokenService)
    private TokenService: ITokenService
  ) {}

  async execute(userId: string, email: string, otp: string) {
    const UserOtpRecord = await this.OtpRepo.findByUserEmail(email);

    if (!UserOtpRecord) throw new Error("No Otp record find");

    // const otpHash = await this.OtpService.hash(otp);
    const valid = await this.OtpService.compare(otp, UserOtpRecord.otpHash);
    if (!valid) throw new Error("Invalid OTP");
    const user = await this.UserRepo.findById(userId);

    if (!user) throw new Error("User not found");
    await this.UserRepo.markVerified(userId);
    await this.OtpRepo.deleteByEmail(email);

    return {
      accessToken: this.TokenService.generateAccessToken({
        userId: user._id,
        role: user.role,
      }),
      refreshToken: this.TokenService.generateRefreshToken({
        userId: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
      }),
      role: user.role,
      message: "Verified successfully",
    };
  }
}
