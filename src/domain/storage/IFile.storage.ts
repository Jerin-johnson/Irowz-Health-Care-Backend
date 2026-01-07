export interface IFileStorage {
  upload(params: { buffer: Buffer; key: string; mimeType: string }): Promise<string>;

  uploadImage(params: { buffer: Buffer; key: string; mimeType: string }): Promise<string>;
}
