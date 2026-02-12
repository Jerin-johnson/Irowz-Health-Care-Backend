import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./aws.s3.config";
import { IFileStorage } from "../../domain/storage/IFile.storage";
import dotenv from "dotenv";
dotenv.config();

export class S3FileStorage implements IFileStorage {
  async uploadPublicImage({
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
        Bucket: process.env.AWS_PUBLIC_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      })
    );

    return `https://${process.env.AWS_PUBLIC_BUCKET}.s3.amazonaws.com/${key}`;
  }

  async uploadPrivatePdf({
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
        Bucket: process.env.AWS_PRIVATE_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      })
    );

    return key;
  }

  async getPrivateFileViewUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_PRIVATE_BUCKET!,
      Key: key,
    });

    return getSignedUrl(s3Client, command, {
      expiresIn: 300,
    });
  }
}
