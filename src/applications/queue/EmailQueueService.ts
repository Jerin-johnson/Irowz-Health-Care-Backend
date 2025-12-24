import { emailQueue } from "../../infrastructure/queue/emailQueue";

export class EmailQueueService {
  async sendOtpEmail(email: string, otp: number) {
    console.log("the queue is inoveded");
    await emailQueue.add("email-queue", {
      to: email,
      otp: otp,
    });
  }
}
