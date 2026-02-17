export interface IGenerateSignedUrlUseCase {
  execute(key: string): Promise<{ signedUrl: string }>;
}
