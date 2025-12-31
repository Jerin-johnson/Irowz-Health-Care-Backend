export interface TokenPayload {
  userId: string;
  role: string;
  name?: string;
  email?: string;
  hosptialId?: string;
  patientId?: string;
  doctorId?: string;
  forcePasswordReset?: boolean;
}

export interface ITokenService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;

  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): TokenPayload;
}
