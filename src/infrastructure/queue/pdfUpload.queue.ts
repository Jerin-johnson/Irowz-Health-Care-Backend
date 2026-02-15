import { Queue } from "bullmq";
import { redisIORedis } from "../redis/ioredis.connection";

export const pdfUploadQueue = new Queue("pdf-upload", {
  connection: redisIORedis,
});
