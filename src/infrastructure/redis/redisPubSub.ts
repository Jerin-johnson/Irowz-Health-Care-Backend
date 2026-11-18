import redisIORedis from "./ioredis.connection";

export const redisPublisher = redisIORedis.duplicate();
export const redisSubscriber = redisIORedis.duplicate();

redisPublisher.on("connect", () => {
  console.log("Redis Publisher connected ✅");
});

redisPublisher.on("error", (err) => {
  console.error("Redis Publisher error:", err);
});

redisSubscriber.on("connect", () => {
  console.log("Redis Subscriber connected ✅");
});

redisSubscriber.on("error", (err) => {
  console.error("Redis Subscriber error:", err);
});
// import Redis from "ioredis";
// import dotenv from "dotenv";
// dotenv.config();

// const REDIS_HOST = process.env.REDIS_HOST || "localhost";
// const REDIS_PORT = process.env.REDIS_PORT || "6379";

// export const redisPublisher = new Redis(`redis://${REDIS_HOST}:${REDIS_PORT}`);
// export const redisSubscriber = new Redis(`redis://${REDIS_HOST}:${REDIS_PORT}`);
