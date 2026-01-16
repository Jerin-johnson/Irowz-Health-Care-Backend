import { TOKENS } from "../../../DI/tsyringe/tokens";
import { IDoctorRepository } from "../../../domain/repositories/IDoctor.repo";
import { IHospitalRepository } from "../../../domain/repositories/IHospital.repo";
import { IPatientProfileRepository } from "../../../domain/repositories/IPatientProfileRepository";
import { IUserRepository } from "../../../domain/repositories/IUser.repo";
import { ITokenService, TokenPayload } from "../../../domain/services/jwt.interface.service";
import { IPasswordService } from "../../../domain/services/password.interface.service";
import { LoginUser } from "../../../domain/types/IUser.types";
import { ILoginUseCase } from "../../../domain/usecase/auth/ILogin.useCase";
import { injectable, inject } from "tsyringe";

@injectable()
export class LoginUseCase implements ILoginUseCase {
  constructor(
    @inject(TOKENS.IUserRepository)
    private UserRepo: IUserRepository,
    @inject(TOKENS.IPasswordService)
    private PasswordService: IPasswordService,
    @inject(TOKENS.ITokenService)
    private TokenService: ITokenService,
    @inject(TOKENS.IHospitalRepository)
    private HosptialRepo: IHospitalRepository,
    @inject(TOKENS.IDoctorRepository)
    private DoctorRepo: IDoctorRepository,
    @inject(TOKENS.IPatientProfileRepository)
    private IPatientProfileRepository: IPatientProfileRepository
  ) {}

  async execute(input: LoginUser, allowedRoles: string[]) {
    const user = await this.UserRepo.findByEmail(input.email);

    console.log(user);

    if (!user) throw new Error("User not exist");
    if (!user.isVerified || user.isBlocked) throw new Error("Restricted entry");

    console.log(allowedRoles, user.role);
    if (!allowedRoles.includes(user.role)) {
      throw new Error("Invalid Access Request");
    }

    const validPassword = await this.PasswordService.compare(input.password, user.password);

    if (!validPassword) throw new Error("Invalid creditionals");

    const tokenPayload: TokenPayload = {
      userId: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    };

    if (user.role === "HOSPITAL_ADMIN") {
      const hospital = await this.HosptialRepo.findByAdminUserId(user._id);
      console.log(hospital);
      if (!hospital) throw new Error("Hospital not found");
      tokenPayload.hosptialId = hospital._id;
    }

    if (user.role === "DOCTOR") {
      const doctor = await this.DoctorRepo.findByUserId(user._id);
      console.log("doctor Id ", doctor);
      if (!doctor) throw new Error("Doctor profile not found");
      tokenPayload.doctorId = doctor._id.toString();
      tokenPayload.hosptialId = doctor.hospitalId.toString();
    }

    tokenPayload.forcePasswordReset = user.forcePasswordReset ? true : false;
    console.log("The token payload", tokenPayload);

    if (user.role === "PATIENT") {
      const patient = await this.IPatientProfileRepository.findByUserId(user._id);
      if (patient) tokenPayload.patientId = String(patient._id);
    }

    return {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken: this.TokenService.generateAccessToken(tokenPayload),
      refreshToken: this.TokenService.generateRefreshToken(tokenPayload),
      hospitalId: tokenPayload.hosptialId,
      forcePasswordReset: user.forcePasswordReset ? true : false,
      doctorId: tokenPayload.doctorId,
      profileImage: user.profileImage,
      patientId: tokenPayload.patientId,
    };
  }
}
