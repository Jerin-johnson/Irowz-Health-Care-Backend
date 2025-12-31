import { GetDoctorProfileUseCase } from "../applications/usecases/doctor/doctorProfile/GetDoctorProfile.UseCase";
import { ResetDoctorPasswordUseCase } from "../applications/usecases/doctor/doctorProfile/ResetPassword.UseCase";
import { DoctorProfileMangementController } from "../presentation/controllers/doctor/DoctorProfileMangement.Controller";
import { DoctorRoutes } from "../presentation/routes/doctor.routes";
import { doctorRepo, mongoUserRepository } from "./repositers";
import { passwordService } from "./service";

const getDoctorProfileUseCase = new GetDoctorProfileUseCase(doctorRepo);
const resetDoctorPassword = new ResetDoctorPasswordUseCase(
  mongoUserRepository,
  passwordService
);

const doctorProfileMangementController = new DoctorProfileMangementController(
  getDoctorProfileUseCase,
  resetDoctorPassword
);

export const doctorRoutes = new DoctorRoutes(doctorProfileMangementController);
