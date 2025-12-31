import { emailQueue } from "../../infrastructure/queue/emailQueue";
import { EmailType } from "../../shared/types/email.type";
interface EmailQueuePayload {
  type: EmailType;
  to: string;
  data: Record<string, any>;
}

export class EmailQueueService {
  private async enqueue(payload: EmailQueuePayload) {
    await emailQueue.add("SEND_EMAIL", payload, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  /**
   * OTP Email
   */
  async sendOtpEmail(email: string, otp: number) {
    console.log("📧 OTP email queued");

    await this.enqueue({
      type: EmailType.OTP,
      to: email,
      data: { otp },
    });
  }

  /**
   * Doctor Credentials Email
   */
  async sendDoctorCredentialsEmail(
    email: string,
    fullName: string,
    password: string
  ) {
    console.log("📧 Doctor credentials email queued");

    await this.enqueue({
      type: EmailType.DOCTOR_CREDENTIALS,
      to: email,
      data: {
        fullName,
        password,
      },
    });
  }

  /**
   * Reset Password Email
   */
  async sendResetPasswordEmail(email: string, resetLink: string) {
    console.log("📧 Reset password email queued");

    await this.enqueue({
      type: EmailType.RESET_PASSWORD,
      to: email,
      data: {
        resetLink,
      },
    });
  }

  /**
   * Generic Email (optional, future-proof)
   */
  async sendGenericEmail(email: string, subject: string, message: string) {
    console.log("📧 Generic email queued");

    await this.enqueue({
      type: EmailType.GENERIC,
      to: email,
      data: {
        subject,
        message,
      },
    });
  }
}
