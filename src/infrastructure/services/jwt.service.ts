import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { ITokenService } from "../../domain/services/jwt.interface.service";

interface TokenPayload {
  userId: string;
  role: string;
}

export class JwtTokenService implements ITokenService {
  private readonly ACCESS_SECRET: Secret;
  private readonly REFRESH_SECRET: Secret;

  private readonly ACCESS_EXPIRES_IN: SignOptions["expiresIn"];
  private readonly REFRESH_EXPIRES_IN: SignOptions["expiresIn"];

  constructor() {
    const access = process.env.JWT_ACCESS_SECRET;
    const refresh = process.env.JWT_REFRESH_SECRET;

    if (!access || !refresh) {
      throw new Error("Missing JWT Secrets in environment variables.");
    }

    this.ACCESS_SECRET = access;
    this.REFRESH_SECRET = refresh;

    this.ACCESS_EXPIRES_IN = "15m";
    this.REFRESH_EXPIRES_IN = "7d";
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign({ ...payload }, this.ACCESS_SECRET, {
      expiresIn: this.ACCESS_EXPIRES_IN,
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign({ ...payload }, this.REFRESH_SECRET, {
      expiresIn: this.REFRESH_EXPIRES_IN,
    });
  }

  verifyAccessToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.ACCESS_SECRET);

      if (
        typeof decoded === "object" &&
        decoded !== null &&
        "userId" in decoded
      ) {
        return decoded as TokenPayload;
      }
      return null;
    } catch (err) {
      // Catching TokenExpiredError or JsonWebTokenError
      return null;
    }
  }
}
