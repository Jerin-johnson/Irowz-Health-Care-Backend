import { OtpRepository } from "../../../domain/repositories/IOtp.repo";
import { UserRepository } from "../../../domain/repositories/IUser.repo";
import { ITokenService } from "../../../domain/services/jwt.interface.service";
import { IOtpService } from "../../../domain/services/otp.interface.service";

export class VerfiyOtpUseCase {
  constructor(
    private UserRepo: UserRepository,
    private OtpRepo: OtpRepository,
    private OtpService: IOtpService,
    private TokenService: ITokenService
  ) {}

  async execute(userId: string, otp: string) {
    const UserOtpRecord = await this.OtpRepo.findByUserId(userId);

    if (!UserOtpRecord) throw new Error("No Otp record find");
    if (UserOtpRecord.expiresAt < new Date()) throw new Error("OTP expired");

    const valid = await this.OtpService.compare(otp, UserOtpRecord.otpHash);
    if (!valid) throw new Error("Invalid OTP");
    const user = await this.UserRepo.findById(userId);

    if (!user) throw new Error("User not found");
    await this.UserRepo.markVerified(userId);
    await this.OtpRepo.deleteByUserId(userId);

    return {
      accessToken: this.TokenService.generateAccessToken({
        userId: user._id,
        role: user.role,
      }),
      refreshToken: this.TokenService.generateRefreshToken({
        userId: user._id,
        role: user.role,
      }),
      message: "Verified successfully",
    };
  }
}
