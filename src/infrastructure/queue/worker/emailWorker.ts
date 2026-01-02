import { Worker } from "bullmq";
import { queueRedisConnection } from "../../redis/ioredis.connection";
import { EmailNotificationService } from "../../services/email.service";

const emailService = new EmailNotificationService();

const worker = new Worker(
  "email-queue",
  async (job) => {
    console.log("📨 Email job received:", job.name);

    const { type, to, data } = job.data;

    switch (type) {
      case "OTP":
        await emailService.sendOtp(to, data.otp);
        break;

      case "DOCTOR_CREDENTIALS":
        await emailService.sendDoctorCredentials(to, data.fullName, data.password);
        break;

      case "RESET_PASSWORD":
        await emailService.sendResetPassword(to, data.resetLink);
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }
  },
  {
    connection: queueRedisConnection,
  }
);

worker.on("completed", (job) => {
  console.log("✅ Email job completed:", job.id);
});

worker.on("failed", (job, err) => {
  console.error("❌ Email job failed:", job?.id, err);
});
