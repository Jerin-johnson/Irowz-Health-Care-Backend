export interface OtpRepository {
  save(userId: string, otpHash: string, ttlSeconds: number): Promise<void>;
  findByUserId(userId: string): Promise<{ otpHash: string } | null>;
  deleteByUserId(userId: string): Promise<void>;
}
