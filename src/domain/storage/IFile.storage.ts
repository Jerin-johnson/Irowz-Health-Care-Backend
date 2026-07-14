export interface IFileStorage {
  uploadPublicImage(params: any): Promise<string>;

  uploadPrivatePdf(params: any): Promise<string>;

  getPrivateFileViewUrl(key: string): Promise<string>;
}
