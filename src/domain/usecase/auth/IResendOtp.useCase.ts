export interface IReSendOtpUseCase {
  execute(email: string): Promise<{
    message: string;
    email: string;
  }>;
}
