export interface OtpCacheRepository {
  saveOtp(userId: string, otp: string, ttlSeconds: number): Promise<void>;
  getOtp(userId: string): Promise<string | null>;
  deleteOtp(userId: string): Promise<void>;
}
