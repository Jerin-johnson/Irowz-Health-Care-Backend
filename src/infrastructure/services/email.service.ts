export class EmailNotificationService {
  async sendOtp(email: string, otp: string) {
    console.log(`Send OTP ${otp} to ${email}`);
  }
}
