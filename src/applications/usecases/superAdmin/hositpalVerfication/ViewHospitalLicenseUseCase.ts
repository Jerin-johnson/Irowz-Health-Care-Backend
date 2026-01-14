import { IHospitalVerificationRepository } from "../../../../domain/repositories/IHospitalVerification.repo";
import { IFileStorage } from "../../../../domain/storage/IFile.storage";

export class ViewHospitalLicenseUseCase {
  constructor(
    private readonly _hospitalVerificationRepo: IHospitalVerificationRepository,
    private readonly _fileStorage: IFileStorage
  ) {}

  async execute(input: { verificationId: string; requesterUserId: string }) {
    const { verificationId } = input;

    const verification = await this._hospitalVerificationRepo.findById(verificationId);

    if (!verification) {
      throw new Error("Verification record not found");
    }

    if (!verification.licenseDocumentKey) {
      throw new Error("License document not uploaded");
    }

    const signedUrl = await this._fileStorage.getPrivateFileViewUrl(
      verification.licenseDocumentKey
    );

    return { signedUrl };
  }
}
