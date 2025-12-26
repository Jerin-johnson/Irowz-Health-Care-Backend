import { ITokenService } from "../../../domain/services/jwt.interface.service";

export class RefreshTokenUseCase {
  constructor(private TokenService: ITokenService) {}

  async execute(token: string) {
    const payload = this.TokenService.verifyAccessToken(token);

    if (!payload) throw new Error("Invalid refresh token");

    const newAccessToken = this.TokenService.generateAccessToken({
      userId: payload.userId,
      role: payload.role,
    });

    return { accessToken: newAccessToken };
  }
}
