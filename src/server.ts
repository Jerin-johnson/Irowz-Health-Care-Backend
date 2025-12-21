import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectRedis } from "./infrastructure/redis/redisClient";
import { connectDB } from "./infrastructure/database/mongo/mongoose.connect";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // infrastructure
    await connectRedis();
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
