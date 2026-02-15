import { CITY_COORDS_MAP } from "../../../ai/tools/geocode-city.tool";
import {
  CreateHospitalVerificationRepository,
  IHospitalVerificationRepository,
} from "../../../domain/repositories/IHospitalVerification.repo";
import { IUserRepository } from "../../../domain/repositories/IUser.repo";
import { IFileStorage } from "../../../domain/storage/IFile.storage";
import { geocodeCityState } from "../../../infrastructure/services/geo.coding.service";

export class ResubmitHospitalVerificationUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _hospitalVerificationRepo: IHospitalVerificationRepository,
    private readonly _fileStorage: IFileStorage
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

    const licenseKey = `hospital-licenses/${existing._id}.pdf`;

    const fileKey = await this._fileStorage.uploadPrivatePdf({
      buffer: fileBuffer,
      key: licenseKey,
      mimeType,
    });

    //location

    let latitude: number | undefined;
    let longitude: number | undefined;

    const normalizedCity = city.toLowerCase().trim().replace(/\s+/g, "");
    const quickCoords = CITY_COORDS_MAP[normalizedCity];

    if (quickCoords) {
      console.log("the qucik Coords exists", quickCoords);
      latitude = quickCoords.lat;
      longitude = quickCoords.lng;
    }

    if (!quickCoords) {
      try {
        const geo = await geocodeCityState(city, state);
        latitude = geo.latitude;
        longitude = geo.longitude;
      } catch (err) {
        console.error("Geocoding failed:", err);
      }
    }

    const result = await this._hospitalVerificationRepo.resumbit(verficationId as string, {
      hospitalAddress,
      pincode,
      city,
      state,
      status: "PENDING",
      adminRemarks: undefined,
      reviewedAt: undefined,
      updatedAt: new Date(),
      licenseDocumentKey: fileKey,
      latitude: latitude || 0,
      longitude: longitude || 0,
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
