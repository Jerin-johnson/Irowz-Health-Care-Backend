export interface IImageProcessor {
  process(buffer: Buffer): Promise<Buffer>;
}
