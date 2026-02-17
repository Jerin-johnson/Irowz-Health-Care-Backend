import { IFileStorage } from "../../../domain/storage/IFile.storage";
import { IGenerateSignedUrlUseCase } from "../../../domain/usecase/privateFile/IGenerateSignedUrlUseCase";

export class GenerateSignedUrlUseCase implements IGenerateSignedUrlUseCase {
  constructor(private fileStorage: IFileStorage) {}

  async execute(key: string) {
    if (!key) {
      throw new Error("File key is required");
    }

    const signedUrl = await this.fileStorage.getPrivateFileViewUrl(key);

    return { signedUrl };
  }
}
