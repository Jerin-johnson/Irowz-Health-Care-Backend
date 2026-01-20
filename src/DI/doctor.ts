import { GetDoctorAppoinmentQueueUsecase } from "../applications/usecases/doctor/appoinment/GetDoctorAppoinmentQueue.usecase";
import { UpsertDoctorAvailabilityUseCase } from "../applications/usecases/doctor/doctorAvailability/DoctorAvailabilityController";
import { EditDoctorProfileUseCase } from "../applications/usecases/doctor/doctorProfile/EditDoctorProfile.UseCase";
import { GetDoctorProfileUseCase } from "../applications/usecases/doctor/doctorProfile/GetDoctorProfile.UseCase";
import { ResetDoctorPasswordUseCase } from "../applications/usecases/doctor/doctorProfile/ResetPassword.UseCase";
import { BlockDoctorSlotUseCase } from "../applications/usecases/doctor/schedule/BlockSlots.Schedule.useCase";
import { GetSlotsScheduleUseCase } from "../applications/usecases/doctor/schedule/GetSlots.schedule.UseCase";
import { DoctorAppointmentController } from "../presentation/controllers/doctor/DoctorAppoinmentController";
import { DoctorAvailabilityController } from "../presentation/controllers/doctor/DoctorAvailabilityController";
import { DoctorProfileMangementController } from "../presentation/controllers/doctor/DoctorProfileMangement.Controller";
import { DoctorScheduleMangmentController } from "../presentation/controllers/doctor/DoctorScheduleMangment.Controller";
import { DoctorRoutes } from "../presentation/routes/doctor.routes";
import { redisDoctorSlotLockService } from "./lock";
import {
  doctorAppointmentRepository,
  doctorAvailabilityRepository,
  doctorRepo,
  mongoUserRepository,
} from "./repositers";
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

const getSlotsScheduleUseCase = new GetSlotsScheduleUseCase(
  doctorAvailabilityRepository,
  doctorAppointmentRepository,
  redisDoctorSlotLockService
);

const blockDoctorSlotUseCase = new BlockDoctorSlotUseCase(
  redisDoctorSlotLockService,
  doctorAppointmentRepository
);

const doctorScheduleMangmentController = new DoctorScheduleMangmentController(
  getSlotsScheduleUseCase,
  blockDoctorSlotUseCase
);

const getDoctorAppoinmentQueueUsecase = new GetDoctorAppoinmentQueueUsecase(
  doctorAppointmentRepository
);

const doctorAppointmentController = new DoctorAppointmentController(
  getDoctorAppoinmentQueueUsecase
);

export const doctorRoutes = new DoctorRoutes(
  doctorProfileMangementController,
  doctorAvailabilityController,
  doctorScheduleMangmentController,
  doctorAppointmentController
);
