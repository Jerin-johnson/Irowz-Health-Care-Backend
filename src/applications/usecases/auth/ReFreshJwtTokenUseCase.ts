import { ITokenService, TokenPayload } from "../../../domain/services/jwt.interface.service";
import { IRefreshTokenUseCase } from "../../../domain/usecase/auth/IRefreshToken.useCase";

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
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

    if (decoded.hosptialId) {
      payload.hosptialId = decoded.hosptialId;
    }
    if (decoded.patientId) {
      payload.patientId = decoded.patientId;
    }

    if (decoded.doctorId) {
      payload.doctorId = decoded.doctorId;
    }

    if (decoded.forcePasswordReset) {
      payload.forcePasswordReset = decoded.forcePasswordReset;
    }

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
        hospitalId: decoded.hosptialId,
        patientId: decoded.patientId,
        doctorId: decoded.doctorId,
        forcePasswordReset: payload.forcePasswordReset ? true : false,
      },
    };
  }
}
