import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redisIORedis = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

redisIORedis.on("connect", () => {
  console.log("IORedis connected ✅");
});

redisIORedis.on("error", (err) => {
  console.error("IORedis error:", err);
});

export default redisIORedis;

// import IORedis from "ioredis";
// import dotenv from "dotenv";
// dotenv.config();

// export const queueRedisConnection = new IORedis({
//   host: "localhost",
//   port: 6379,
//   maxRetriesPerRequest: null,
// });

// export const queueRedisConnection = new IORedis({
//   host: process.env.REDIS_HOST || "localhost",
//   port: Number(process.env.REDIS_PORT) || 6379,
//   maxRetriesPerRequest: null,
// });
