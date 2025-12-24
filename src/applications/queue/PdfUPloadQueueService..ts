import { pdfUploadQueue } from "../../infrastructure/queue/pdfUpload.queue";

export class PdfUploadQueueService {
  async addUploadJob(data: {
    hospitalId: string;
    buffer: Buffer;
    mimeType: string;
  }): Promise<void> {
    console.log("PDF upload queue invoked");

    await pdfUploadQueue.add("pdf-upload", {
      hospitalId: data.hospitalId,
      buffer: data.buffer,
      mimeType: data.mimeType,
    });
  }
}
