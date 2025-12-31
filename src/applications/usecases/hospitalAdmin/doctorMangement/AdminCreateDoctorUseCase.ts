import { EmailQueueService } from "../../../queue/EmailQueueService";
import { UserRepository } from "../../../../domain/repositories/IUser.repo";
import { IDoctorRepository } from "../../../../domain/repositories/IDoctor.repo";
import UserRoles from "../../../../domain/constants/UserRole";
import { createUser } from "../../../../domain/types/IUser.types";
import { generatePlainPassword } from "../../../utils/password";
import { AdminCreateDoctorDTO } from "../../../dtos/hosptialAdmin/doctorMangement/admin-create-doctor.dto";
import { IHospitalSpecialtyRepository } from "../../../../domain/repositories/IHospitalSpecaility.repo";
import { IPasswordService } from "../../../../domain/services/password.interface.service";

export class AdminCreateDoctorUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly doctorRepo: IDoctorRepository,
    private readonly queueService: EmailQueueService,
    private readonly specialtyRepository: IHospitalSpecialtyRepository,
    private passwordService: IPasswordService
  ) {}

  async execute(input: AdminCreateDoctorDTO) {
    const plainPassword = generatePlainPassword();

    const speciality = await this.specialtyRepository.findById(
      input.specialtyId as string
    );
    if (!speciality)
      throw new Error(
        "Such speciality does exist inside your hospital...please create one"
      );

    const hashPassword = await this.passwordService.hash(plainPassword);

    const user = await this.userRepo.create({
      name: input.fullName as string,
      email: input.email as string,
      phone: input.phone as string,
      role: UserRoles.DOCTOR,
      password: hashPassword,
      isVerified: true,
      forcePasswordReset: true,
    } as createUser);

    if (!user)
      throw new Error(
        "create of the user i.e doctor failed...please try again later"
      );

    const doctor = await this.doctorRepo.create({
      userId: user._id as string,
      hospitalId: input.hospitalId,
      specialtyId: input.specialtyId as string,
      experienceYears: input.experienceYears,
      consultationFee: input.consultationFee,
      bio: input.bio,
      medicalRegistrationNumber: input.medicalRegistrationNumber,
      medicalCouncil: input.medicalCouncil,
      medicalCertificate: "null",
      teleConsultationEnabled: input.teleConsultationEnabled ?? false,
      isActive: true,
    });

    await this.queueService.sendDoctorCredentialsEmail(
      input.email,
      input.fullName,
      plainPassword
    );

    return {
      doctorId: doctor._id,
      userId: user._id,
    };
  }
}
