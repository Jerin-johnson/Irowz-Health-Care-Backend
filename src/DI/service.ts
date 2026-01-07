import { PasswordService } from "../infrastructure/services/bcrypt.password.service";
import { EmailNotificationService } from "../infrastructure/services/email.service";
import { JwtTokenService } from "../infrastructure/services/jwt.service";
import { RandomOtpService } from "../infrastructure/services/otp.service";
import { PdfUploadQueueService } from "../applications/queue/PdfUPloadQueueService.";
import { S3FileStorage } from "../infrastructure/storage/S3FileStoragePdf";
import { SharpImageProcessor } from "../infrastructure/services/sharpImage.service";
// import { pdfUploadQueue } from "../infrastructure/queue/pdfUpload.queue";
//services
export const passwordService = new PasswordService();
export const emailNotificationService = new EmailNotificationService();
export const jwtTokenService = new JwtTokenService();
export const otpService = new RandomOtpService();
export const pdfUPloadQueueService = new PdfUploadQueueService();
export const s3FileStorage = new S3FileStorage();
export const sharpImageProcessor = new SharpImageProcessor();
