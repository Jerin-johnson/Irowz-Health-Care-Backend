import { GetDoctorProfileUseCase } from "../applications/usecases/doctor/GetDoctorProfile.UseCase";
import { DoctorProfileMangementController } from "../presentation/controllers/doctor/DoctorProfileMangement.Controller";
import { DoctorRoutes } from "../presentation/routes/doctor.routes";
import { doctorRepo } from "./repositers";

const getDoctorProfileUseCase = new GetDoctorProfileUseCase(doctorRepo);

const doctorProfileMangementController = new DoctorProfileMangementController(
  getDoctorProfileUseCase
);

export const doctorRoutes = new DoctorRoutes(doctorProfileMangementController);
