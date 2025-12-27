import {
  CreateHospitalVerificationRepository,
  HospitalVerification,
  IHospitalVerificationRepository,
} from "../../../domain/repositories/IHospitalVerification.repo";
import { UserRepository } from "../../../domain/repositories/IUser.repo";
import { IPasswordService } from "../../../domain/services/password.interface.service";
import UserRoles from "../../../domain/constants/UserRole";
import { PdfUploadQueueService } from "../../queue/PdfUPloadQueueService.";

export class SubmitHositalVerficationRequest {
  constructor(
    private userRepo: UserRepository,
    private HosptialVerficatinRepo: IHospitalVerificationRepository,
    private PasswordService: IPasswordService,
    private pdfUploadQueue: PdfUploadQueueService
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

    const existerHosptialAdmin = await this.userRepo.findByEmail(officialEmail);

    if (existerHosptialAdmin) {
      throw new Error(
        "the email is already register and check the status of email"
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

    if (!HospitalAdminUser)
      throw new Error("cannot able to create hositpal admin user");

    const HospitalVerficationRequest = await this.HosptialVerficatinRepo.create(
      {
        userId: HospitalAdminUser._id,
        hospitalName: hospitalName,
        registrationNumber: registrationNumber,
        hospitalAddress: hospitalAddress,
        city: city,
        state: state,
        pincode: pincode,
        officialEmail: officialEmail,
        phone: phone,
        licenseDocumentUrl: "pending",
        submittedAt: new Date(),
      }
    );

    await this.pdfUploadQueue.addUploadJob({
      hospitalId: HospitalVerficationRequest._id as string,
      buffer: fileBuffer,
      mimeType: mimeType,
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
