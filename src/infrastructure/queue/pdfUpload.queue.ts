import { Queue } from "bullmq";
import { queueRedisConnection } from "../redis/ioredis.connection";

export const pdfUploadQueue = new Queue("pdf-upload", {
  connection: queueRedisConnection,
});
