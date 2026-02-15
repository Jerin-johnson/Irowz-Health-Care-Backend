import redisIORedis from "./ioredis.connection";

export const redisPublisher = redisIORedis.duplicate();
export const redisSubscriber = redisIORedis.duplicate();

redisPublisher.connect(() => {
  console.log("the publiseher connected");
});
// import Redis from "ioredis";
// import dotenv from "dotenv";
// dotenv.config();

// const REDIS_HOST = process.env.REDIS_HOST || "localhost";
// const REDIS_PORT = process.env.REDIS_PORT || "6379";

// export const redisPublisher = new Redis(`redis://${REDIS_HOST}:${REDIS_PORT}`);
// export const redisSubscriber = new Redis(`redis://${REDIS_HOST}:${REDIS_PORT}`);
