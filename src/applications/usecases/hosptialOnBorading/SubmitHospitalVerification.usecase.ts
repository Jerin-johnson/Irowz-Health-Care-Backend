import {
  CreateHospitalVerificationRepository,
  IHospitalVerificationRepository,
} from "../../../domain/repositories/IHospitalVerification.repo";
import { IUserRepository } from "../../../domain/repositories/IUser.repo";
import { IPasswordService } from "../../../domain/services/password.interface.service";
import UserRoles from "../../../domain/constants/UserRole";
import { ISubmitHospitalVerificationRequestUseCase } from "../../../domain/usecase/hospitalOnBoarding/ISubmitHospitalVerificationRequest.usecase";
import { geocodeCityState } from "../../../infrastructure/services/geo.coding.service";
import { IFileStorage } from "../../../domain/storage/IFile.storage";
import { CITY_COORDS_MAP } from "../../../ai/tools/geocode-city.tool";

export class SubmitHositalVerficationRequest implements ISubmitHospitalVerificationRequestUseCase {
  constructor(
    private userRepo: IUserRepository,
    private HosptialVerficatinRepo: IHospitalVerificationRepository,
    private PasswordService: IPasswordService,
    private fileStorage: IFileStorage
  ) {}

  async execute(input: CreateHospitalVerificationRepository) {
    console.log("hai hello", input);
    const {
      hospitalName,
      city,
      hospitalAddress,
      officialEmail,
      password,
      phone,
      pincode,
      registrationNumber,
      state,
      fileBuffer,
      mimeType,
    } = input;

    console.log("the input", input);

    const existerHosptialAdmin = await this.userRepo.findByEmail(officialEmail, phone);

    if (existerHosptialAdmin) {
      throw new Error(
        "the email or phone number is already register and check the status of email"
      );
    }

    const hashedPassword = await this.PasswordService.hash(password as string);

    const HospitalAdminUser = await this.userRepo.create({
      name: "change this name",
      email: officialEmail,
      phone: phone,
      password: hashedPassword,
      role: UserRoles.HOSPITAL_ADMIN,
      isBlocked: false,
      isVerified: false,
    });

    if (!HospitalAdminUser) throw new Error("cannot able to create hositpal admin user");

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

    const licenseKey = `hospital-licenses/${HospitalAdminUser._id}.pdf`;

    const fileKey = await this.fileStorage.uploadPrivatePdf({
      buffer: fileBuffer,
      key: licenseKey,
      mimeType,
    });

    const HospitalVerficationRequest = await this.HosptialVerficatinRepo.create({
      userId: HospitalAdminUser._id,
      hospitalName: hospitalName,
      registrationNumber: registrationNumber,
      hospitalAddress: hospitalAddress,
      city: city,
      state: state,
      pincode: pincode,
      officialEmail: officialEmail,
      phone: phone,
      licenseDocumentKey: fileKey,
      submittedAt: new Date(),
      latitude: latitude || 0,
      longitude: longitude || 0,
    });

    return {
      data: {
        userId: HospitalAdminUser._id,
        role: HospitalAdminUser.role,
        verificationId: HospitalVerficationRequest._id,
        name: HospitalVerficationRequest.hospitalName,
        city: HospitalVerficationRequest.city,
        email: HospitalVerficationRequest.officialEmail,
        registrationNumber: HospitalVerficationRequest.registrationNumber,
      },
    };
  }
}
