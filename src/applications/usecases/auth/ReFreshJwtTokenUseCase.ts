import {
  ITokenService,
  TokenPayload,
} from "../../../domain/services/jwt.interface.service";

export class RefreshTokenUseCase {
  constructor(private TokenService: ITokenService) {}

  async execute(token: string) {
    const decoded: TokenPayload = this.TokenService.verifyRefreshToken(token);

    console.log(decoded);

    const payload: TokenPayload = {
      userId: decoded.userId,
      role: decoded.role,
      name: decoded.name,
      email: decoded.email,
    };

    //  Rotate tokens
    const newAccessToken = this.TokenService.generateAccessToken(payload);

    const newRefreshToken = this.TokenService.generateRefreshToken(payload);

    if (!payload) throw new Error("Invalid refresh token");

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        userId: decoded.userId,
        role: decoded.role,
        name: decoded.name,
        email: decoded.email,
      },
    };
  }
}
