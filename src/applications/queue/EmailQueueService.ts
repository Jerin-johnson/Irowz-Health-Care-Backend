import { emailQueue } from "../../infrastructure/queue/emailQueue";

export class EmailQueueService {
  async sendOtpEmail(email: string, otp: number) {
    await emailQueue.add("send-welcome-email", {
      to: email,
      otp: otp,
    });
  }
}
//t only adds a job to Redis bull mq
