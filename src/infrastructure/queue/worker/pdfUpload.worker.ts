import { Worker } from "bullmq";
import { S3FileStorage } from "../../storage/S3FileStoragePdf";
import { HospitalVerificationRepositoryImpl } from "../../repositories/HospitalVerification.repository";
import { queueRedisConnection } from "../../redis/ioredis.connection";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const storage = new S3FileStorage();
const repo = new HospitalVerificationRepositoryImpl();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("🟢 Worker MongoDB connected");
  } catch (err) {
    console.error("🔴 Worker MongoDB connection failed", err);
    process.exit(1);
  }
})();

new Worker(
  "pdf-upload",
  async (job) => {
    console.log("hai job ready pdf quque");
    const { hospitalId, buffer, mimeType } = job.data;

    const key = `hospital-licenses/${hospitalId}.pdf`;

    const url = await storage.upload({
      buffer,
      key,
      mimeType,
    });

    console.log(hospitalId, buffer, mimeType);

    const result = await repo.update(hospitalId, {
      licenseDocumentUrl: url,
    });
    console.log("pdf upload successfully");
  },
  { connection: queueRedisConnection }
);
