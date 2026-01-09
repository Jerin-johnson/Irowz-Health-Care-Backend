export interface IVerifyOtpUseCase {
  execute(
    userId: string,
    email: string,
    otp: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    role: string;
    message: string;
  }>;
}
