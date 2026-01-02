import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { ITokenService, TokenPayload } from "../../domain/services/jwt.interface.service";

export class JwtTokenService implements ITokenService {
  private readonly ACCESS_SECRET: Secret;
  private readonly REFRESH_SECRET: Secret;

  private readonly ACCESS_EXPIRES_IN: SignOptions["expiresIn"] = "15m";
  private readonly REFRESH_EXPIRES_IN: SignOptions["expiresIn"] = "7d";

  constructor() {
    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets are not configured");
    }

    this.ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
    this.REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.ACCESS_SECRET, {
      expiresIn: this.ACCESS_EXPIRES_IN,
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.REFRESH_SECRET, {
      expiresIn: this.REFRESH_EXPIRES_IN,
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    return this.verify(token, this.ACCESS_SECRET);
  }

  verifyRefreshToken(token: string): TokenPayload {
    return this.verify(token, this.REFRESH_SECRET);
  }

  private verify(token: string, secret: Secret): TokenPayload {
    try {
      const decoded = jwt.verify(token, secret);

      if (typeof decoded !== "object" || !("userId" in decoded)) {
        throw new Error("Invalid token payload");
      }

      return decoded as TokenPayload;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}
