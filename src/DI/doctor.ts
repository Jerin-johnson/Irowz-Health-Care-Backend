import { UpsertDoctorAvailabilityUseCase } from "../applications/usecases/doctor/doctorAvailability/DoctorAvailabilityController";
import { GetDoctorProfileUseCase } from "../applications/usecases/doctor/doctorProfile/GetDoctorProfile.UseCase";
import { ResetDoctorPasswordUseCase } from "../applications/usecases/doctor/doctorProfile/ResetPassword.UseCase";
import { DoctorAvailabilityController } from "../presentation/controllers/doctor/DoctorAvailabilityController";
import { DoctorProfileMangementController } from "../presentation/controllers/doctor/DoctorProfileMangement.Controller";
import { DoctorRoutes } from "../presentation/routes/doctor.routes";
import { doctorAvailabilityRepository, doctorRepo, mongoUserRepository } from "./repositers";
import { passwordService } from "./service";

const getDoctorProfileUseCase = new GetDoctorProfileUseCase(doctorRepo);
const resetDoctorPassword = new ResetDoctorPasswordUseCase(mongoUserRepository, passwordService);

const doctorProfileMangementController = new DoctorProfileMangementController(
  getDoctorProfileUseCase,
  resetDoctorPassword
);

const upsertDoctorAvailabilityUseCase = new UpsertDoctorAvailabilityUseCase(
  doctorAvailabilityRepository
);

const doctorAvailabilityController = new DoctorAvailabilityController(
  upsertDoctorAvailabilityUseCase
);

export const doctorRoutes = new DoctorRoutes(
  doctorProfileMangementController,
  doctorAvailabilityController
);
