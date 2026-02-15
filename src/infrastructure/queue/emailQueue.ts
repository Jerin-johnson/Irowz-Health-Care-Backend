import { Queue } from "bullmq";
import { redisIORedis } from "../redis/ioredis.connection";

export const emailQueue = new Queue("email-queue", {
  connection: redisIORedis,
});
