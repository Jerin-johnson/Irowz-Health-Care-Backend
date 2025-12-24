import { Worker } from "bullmq";
import { EmailNotificationService } from "../../services/email.service";
import { queueRedisConnection } from "../../redis/ioredis.connection";

const emailService = new EmailNotificationService();

// export const redisConnection = {
//   host: "127.0.0.1",
//   port: 6379,
// };

const worker = new Worker(
  "email-queue",
  async (job) => {
    console.log("hai job ready");
    const { to, otp } = job.data;
    await emailService.sendOtp(to, otp);
  },
  { connection: queueRedisConnection }
);

worker.on("completed", (job) => {
  console.log(" Job completed:", job.id);
});

worker.on("failed", (job, err) => {
  console.error(" Job failed:", job?.id, err);
});
