import {
  CreateHospitalVerificationRepository,
  IHospitalVerificationRepository,
} from "../../../domain/repositories/IHospitalVerification.repo";
import { IUserRepository } from "../../../domain/repositories/IUser.repo";
import { PdfUploadQueueService } from "../../queue/PdfUPloadQueueService.";

export class ResubmitHospitalVerificationUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _hospitalVerificationRepo: IHospitalVerificationRepository,
    private _pdfUploadQueue: PdfUploadQueueService
  ) {}

  async execute(verficationId: string, input: CreateHospitalVerificationRepository) {
    const { city, hospitalAddress, pincode, state, fileBuffer, mimeType } = input;

    console.log("re apply", verficationId, input);

    const existing = await this._hospitalVerificationRepo.findById(verficationId);

    console.log("the existing", existing);

    if (!existing) throw new Error("No record found on submission");

    if (existing.status === "PENDING") {
      throw new Error("Verification already under review");
    }

    if (existing.status === "APPROVED") {
      throw new Error("Hospital already verified");
    }

    const user = await this._userRepo.findById(existing.userId as string);
    if (!user) {
      throw new Error("User not found");
    }

    console.log("The user is ", user);

    const result = await this._hospitalVerificationRepo.resumbit(verficationId as string, {
      hospitalAddress,
      pincode,
      city,
      state,
      status: "PENDING",
      adminRemarks: undefined,
      reviewedAt: undefined,
      updatedAt: new Date(),
    });

    console.log("The result is", result);

    await this._pdfUploadQueue.addUploadJob({
      hospitalId: result._id as string,
      buffer: fileBuffer,
      mimeType: mimeType,
    });

    console.log(result);

    return {
      message: "Verification resubmitted",
      data: {
        city: input.city,
      },
    };
  }
}
