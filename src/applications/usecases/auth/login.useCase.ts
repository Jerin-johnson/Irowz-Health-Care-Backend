import { IHospitalRepository } from "../../../domain/repositories/IHospital.repo";
import { UserRepository } from "../../../domain/repositories/IUser.repo";
import {
  ITokenService,
  TokenPayload,
} from "../../../domain/services/jwt.interface.service";
import { IPasswordService } from "../../../domain/services/password.interface.service";
import { LoginUser } from "../../../domain/types/IUser.types";

export class LoginUseCase {
  constructor(
    private UserRepo: UserRepository,
    private PasswordService: IPasswordService,
    private TokenService: ITokenService,
    private HosptialRepo: IHospitalRepository
  ) {}

  async execute(input: LoginUser, allowedRoles: string[]) {
    const user = await this.UserRepo.findByEmail(input.email);

    if (!user) throw new Error("User not exist");
    if (!user.isVerified || user.isBlocked) throw new Error("Restricted entry");

    console.log(allowedRoles, user.role);
    if (!allowedRoles.includes(user.role)) {
      throw new Error("Invalid Access Request");
    }

    const validPassword = await this.PasswordService.compare(
      input.password,
      user.password
    );

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

    // if (user.role === "DOCTOR") {
    //   const doctor = await this.DoctorRepo.findByUserId(user._id);
    //   if (!doctor) throw new Error("Doctor profile not found");
    //   tokenPayload.doctorId = doctor._id;
    //   tokenPayload.hospitalId = doctor.hospitalId;
    // }

    // if (user.role === "PATIENT") {
    //   const patient = await this.PatientRepo.findByUserId(user._id);
    //   if (!patient) throw new Error("Patient profile not found");
    //   tokenPayload.patientId = patient._id;
    // }

    return {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken: this.TokenService.generateAccessToken(tokenPayload),
      refreshToken: this.TokenService.generateRefreshToken(tokenPayload),
      hospitalId: tokenPayload.hosptialId,
    };
  }
}
