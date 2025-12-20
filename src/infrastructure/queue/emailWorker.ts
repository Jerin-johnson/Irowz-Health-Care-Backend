import { Worker } from "bullmq";
import { EmailNotificationService } from "../services/email.service";

const emailService = new EmailNotificationService();

new Worker(
  "email-queue",
  async (job) => {
    const { to, otp } = job.data;
    await emailService.sendOtp(to, otp);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

console.log("Email worker started");
