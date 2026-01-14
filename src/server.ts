import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app";
import { connectRedis } from "./infrastructure/redis/redisClient";
import { connectDB } from "./infrastructure/database/mongo/mongoose.connect";
import { setupSocket } from "./socket";
import { startPaymentExpiryCron } from "./cron/paymentExpiry.cron";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectRedis();
    await connectDB();
    startPaymentExpiryCron();

    const server = http.createServer(app);

    setupSocket(server);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
