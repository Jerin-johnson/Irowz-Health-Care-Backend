import { UpsertDoctorAvailabilityUseCase } from "../applications/usecases/doctor/doctorAvailability/DoctorAvailabilityController";
import { EditDoctorProfileUseCase } from "../applications/usecases/doctor/doctorProfile/EditDoctorProfile.UseCase";
import { GetDoctorProfileUseCase } from "../applications/usecases/doctor/doctorProfile/GetDoctorProfile.UseCase";
import { ResetDoctorPasswordUseCase } from "../applications/usecases/doctor/doctorProfile/ResetPassword.UseCase";
import { DoctorAvailabilityController } from "../presentation/controllers/doctor/DoctorAvailabilityController";
import { DoctorProfileMangementController } from "../presentation/controllers/doctor/DoctorProfileMangement.Controller";
import { DoctorRoutes } from "../presentation/routes/doctor.routes";
import { doctorAvailabilityRepository, doctorRepo, mongoUserRepository } from "./repositers";
import { passwordService, s3FileStorage, sharpImageProcessor } from "./service";

const getDoctorProfileUseCase = new GetDoctorProfileUseCase(doctorRepo);
const resetDoctorPassword = new ResetDoctorPasswordUseCase(mongoUserRepository, passwordService);

const editDoctorProfileUseCase = new EditDoctorProfileUseCase(
  mongoUserRepository,
  doctorRepo,
  s3FileStorage,
  sharpImageProcessor
);

const doctorProfileMangementController = new DoctorProfileMangementController(
  getDoctorProfileUseCase,
  resetDoctorPassword,
  editDoctorProfileUseCase
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
