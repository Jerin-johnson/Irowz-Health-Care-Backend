import { PasswordService } from "../infrastructure/services/bcrypt.password.service";
import { EmailNotificationService } from "../infrastructure/services/email.service";
import { JwtTokenService } from "../infrastructure/services/jwt.service";
import { RandomOtpService } from "../infrastructure/services/otp.service";

//services
export const passwordService = new PasswordService();
export const emailNotificationService = new EmailNotificationService();
export const jwtTokenService = new JwtTokenService();
export const otpService = new RandomOtpService();
