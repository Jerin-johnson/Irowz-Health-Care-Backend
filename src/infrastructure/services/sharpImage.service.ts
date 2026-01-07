import sharp from "sharp";
import { IImageProcessor } from "../../domain/services/ImageProcess.service";

export class SharpImageProcessor implements IImageProcessor {
  async process(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
      .rotate()
      .resize(400, 400, {
        fit: "cover",
      })
      .jpeg({
        quality: 80,
        mozjpeg: true,
      })
      .toBuffer();
  }
}
