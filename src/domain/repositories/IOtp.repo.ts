export interface IOtpRepository {
  save(email: string, otpHash: string, ttlSeconds: number): Promise<void>;
  findByUserEmail(email: string): Promise<{ otpHash: string } | null>;
  deleteByEmail(email: string): Promise<void>;
}
