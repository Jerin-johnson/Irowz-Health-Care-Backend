import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./aws.s3.config";
import dotenv from "dotenv";

dotenv.config();
export class S3FileStorage {
  async upload({ buffer, key, mimeType }: any) {
    try {
      const fileBuffer = Buffer.from(buffer.data);
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
          Body: fileBuffer,
          ContentType: mimeType,
        })
      );

      return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
    } catch (error: any) {
      console.log(error);
    }
  }
}
