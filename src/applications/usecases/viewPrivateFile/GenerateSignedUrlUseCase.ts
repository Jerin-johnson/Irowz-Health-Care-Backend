import { IFileStorage } from "../../../domain/storage/IFile.storage";

export class GenerateSignedUrlUseCase {
  constructor(private fileStorage: IFileStorage) {}

  async execute(key: string) {
    if (!key) {
      throw new Error("File key is required");
    }

    const signedUrl = await this.fileStorage.getPrivateFileViewUrl(key);

    return { signedUrl };
  }
}
