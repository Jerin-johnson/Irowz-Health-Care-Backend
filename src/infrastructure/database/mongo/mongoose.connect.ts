import { connect } from "mongoose";
const MONGO_URI = process.env.MONGO_URI as string;

export const connectDB = async () => {
  try {
    await connect(MONGO_URI);
    console.log(" MongoDB Connected successfully");
  } catch (err) {
    console.error(" MongoDB Connection Error:", err);
    process.exit(1);
  }
};
