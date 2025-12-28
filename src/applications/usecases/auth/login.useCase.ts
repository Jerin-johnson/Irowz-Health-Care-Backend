import { email } from "zod";
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

  async execute(input: LoginUser, allowedRoles: string[]) {
    const user = await this.UserRepo.findByEmail(input.email);

    if (!user) throw new Error("User not exist");
    if (!user.isVerified || user.isBlocked) throw new Error("Restricted entry");

    console.log(allowedRoles, user.role);
    if (!allowedRoles.includes(user.role)) {
      throw new Error("Invalid Access Request");
    }

    const validPassword = await this.PasswordService.compare(
      input.password,
      user.password
    );

    if (!validPassword) throw new Error("Invalid creditionals");

    return {
      userId: user._id,
      name: user.name,
      email: user.email,
      accessToken: this.TokenService.generateAccessToken({
        userId: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      }),
      refreshToken: this.TokenService.generateRefreshToken({
        userId: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      }),
      role: user.role,
    };
  }
}
