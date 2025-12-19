export interface OtpRepository {
  save(otp: any): Promise<void>;
  findByUserId(userId: string): Promise<null>;
  deleteByUserId(userId: string): Promise<void>;
}
