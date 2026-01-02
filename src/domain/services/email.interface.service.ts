export interface IEmailService {
  sendOtp(email: string, otp: string): Promise<void>;

  sendDoctorCredentials(email: string, fullName: string, password: string): Promise<void>;

  sendResetPassword(email: string, resetLink: string): Promise<void>;
}
