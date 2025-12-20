import express from "express";
import dotenv from "dotenv";
import { mongoSanitizeMiddleware } from "./presentation/middlewares/mongoSanitize.middleware";
import { connectRedis } from "./infrastructure/redis/redisClient";
dotenv.config();
import redisClient from "./infrastructure/redis/redisClient";

const app = express();

async function start() {
  await connectRedis();
  await redisClient.set("hello", "world");
  const value = await redisClient.get("hello");

  console.log("Redis value:", value);
}

start();
app.use(express.json());
app.use(mongoSanitizeMiddleware);

const port = process.env.PORT;

app.listen(port, () => {
  console.log("the server is running");
});
