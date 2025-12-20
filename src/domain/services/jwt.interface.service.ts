interface TokenPayload {
  userId: string;
  role: string;
}

export interface ITokenService {
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
  verifyAccessToken(token: string): TokenPayload | null;
}
