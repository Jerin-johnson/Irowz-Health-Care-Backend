export interface IFileStorage {
  uploadPublicImage(params: { buffer: Buffer; key: string; mimeType: string }): Promise<string>;

  uploadPrivatePdf(params: { buffer: Buffer; key: string; mimeType: string }): Promise<string>;

  getPrivateFileViewUrl(key: string): Promise<string>;
}
