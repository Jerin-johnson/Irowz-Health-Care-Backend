import { emailQueue } from "../../infrastructure/queue/emailQueue";
import { EmailType } from "../../shared/types/email.type";

export interface OtpEmailData {
  otp: number;
}

export interface DoctorCredentialsEmailData {
  fullName: string;
  password: string;
}

export interface ResetPasswordEmailData {
  resetLink: string;
}

export interface GenericEmailData {
  subject: string;
  message: string;
}

export type EmailQueuePayload =
  | {
      type: EmailType.OTP;
      to: string;
      data: OtpEmailData;
    }
  | {
      type: EmailType.DOCTOR_CREDENTIALS;
      to: string;
      data: DoctorCredentialsEmailData;
    }
  | {
      type: EmailType.RESET_PASSWORD;
      to: string;
      data: ResetPasswordEmailData;
    }
  | {
      type: EmailType.GENERIC;
      to: string;
      data: GenericEmailData;
    };

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
  async sendDoctorCredentialsEmail(email: string, fullName: string, password: string) {
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
