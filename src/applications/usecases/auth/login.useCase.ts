import { UserRepository } from "../../../domain/repositories/IUser.repo";
import { ITokenService } from "../../../domain/services/jwt.interface.service";
import { IPasswordService } from "../../../domain/services/password.interface.service";
import { LoginUser } from "../../../domain/types/IUser.types";

export class LoginUseCase {
  constructor(
    private UserRepo: UserRepository,
    private PasswordService: IPasswordService,
    private TokenService: ITokenService
  ) {}

  async execute(input: LoginUser) {
    const user = await this.UserRepo.findByEmail(input.email);

    if (!user) throw new Error("User not exist");
    if (!user.isVerified || user.isBlocked) throw new Error("Restricted entry");

    const validPassword = await this.PasswordService.compare(
      input.password,
      user.password
    );

    if (!validPassword) throw new Error("Invalid creditionals");

    return {
      accessToken: this.TokenService.generateAccessToken({
        userId: user._id,
        role: user.role,
      }),
      refreshToken: this.TokenService.generateRefreshToken({
        userId: user._id,
        role: user.role,
      }),
    };
  }
}
