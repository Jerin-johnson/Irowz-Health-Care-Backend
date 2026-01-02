import IORedis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

// export const queueRedisConnection = new IORedis({
//   host: "localhost",
//   port: 6379,
//   maxRetriesPerRequest: null,
// });

export const queueRedisConnection = new IORedis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});
