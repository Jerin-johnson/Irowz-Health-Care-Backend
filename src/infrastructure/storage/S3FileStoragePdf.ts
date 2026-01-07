import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./aws.s3.config";
import dotenv from "dotenv";
import { IFileStorage } from "../../domain/storage/IFile.storage";

dotenv.config();
export class S3FileStorage implements IFileStorage {
  async upload(params: { buffer: any; key: string; mimeType: string }): Promise<string> {
    try {
      const fileBuffer = Buffer.from(params.buffer.data);
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: params.key,
          Body: fileBuffer,
          ContentType: params.mimeType,
        })
      );

      return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${params.key}`;
    } catch (error: any) {
      console.log(error);
      return "";
    }
  }

  async uploadImage({
    buffer,
    key,
    mimeType,
  }: {
    buffer: Buffer;
    key: string;
    mimeType: string;
  }): Promise<string> {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      })
    );

    return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
  }
}
