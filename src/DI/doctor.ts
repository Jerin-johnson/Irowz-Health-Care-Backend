import { GetAppoinmentBYIdUseCase } from "../applications/usecases/doctor/appoinment/GetAppoinmentBYIdUseCase";
import { GetDoctorAppoinmentQueueUsecase } from "../applications/usecases/doctor/appoinment/GetDoctorAppoinmentQueue.usecase";
import { CompleteConsultationUseCase } from "../applications/usecases/doctor/consultation/CompleteConsultation.UseCase";
import { GetPatientOverViewUseCase } from "../applications/usecases/doctor/consultation/GetPatientOverview.useCase";
import { MarkAsNoShowUseCase } from "../applications/usecases/doctor/consultation/MarkAsNoShow.UseCase";
import { EndConsultationOnlineUseCase } from "../applications/usecases/doctor/consultation/online/EndOnlineConsultationUseCase";
import { GetActiveDoctorOnlineConsultationUseCase } from "../applications/usecases/doctor/consultation/online/GetActiveDoctorConsultationUseCase";
import { GetConsultationVideoTokenDoctorUseCase } from "../applications/usecases/doctor/consultation/online/GetConsultationVideoTokenUseCase";
import { SaveQuickNoteUseCase } from "../applications/usecases/doctor/consultation/SaveQuickNoteUseCase";
import { StartConsultationUseCase } from "../applications/usecases/doctor/consultation/StartConsultation.UseCase";
import { UpsertDoctorAvailabilityUseCase } from "../applications/usecases/doctor/doctorAvailability/DoctorAvailabilityController";
import { EditDoctorProfileUseCase } from "../applications/usecases/doctor/doctorProfile/EditDoctorProfile.UseCase";
import { GetDoctorProfileUseCase } from "../applications/usecases/doctor/doctorProfile/GetDoctorProfile.UseCase";
import { ResetDoctorPasswordUseCase } from "../applications/usecases/doctor/doctorProfile/ResetPassword.UseCase";
import { BlockDoctorSlotUseCase } from "../applications/usecases/doctor/schedule/BlockSlots.Schedule.useCase";
import { GetSlotsScheduleUseCase } from "../applications/usecases/doctor/schedule/GetSlots.schedule.UseCase";
import { DoctorAppointmentController } from "../presentation/controllers/doctor/DoctorAppoinmentController";
import { DoctorAvailabilityController } from "../presentation/controllers/doctor/DoctorAvailabilityController";
import { DoctorConsultationController } from "../presentation/controllers/doctor/DoctorConsultation.Controller";
import { DoctorProfileMangementController } from "../presentation/controllers/doctor/DoctorProfileMangement.Controller";
import { DoctorScheduleMangmentController } from "../presentation/controllers/doctor/DoctorScheduleMangment.Controller";
import { DoctorRoutes } from "../presentation/routes/doctor.routes";
import { redisDoctorSlotLockService } from "./lock";
import { realtimePublisher } from "./realtime";
import {
  consultationRepo,
  doctorAppointmentRepository,
  doctorAvailabilityRepository,
  doctorRepo,
  medicalRecordRepository,
  mongoUserRepository,
  patientProfileRepository,
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

const getAppoinmentBYIdUseCase = new GetAppoinmentBYIdUseCase(doctorAppointmentRepository);

const doctorAppointmentController = new DoctorAppointmentController(
  getDoctorAppoinmentQueueUsecase,
  getAppoinmentBYIdUseCase
);

const startConsultationUseCase = new StartConsultationUseCase(
  doctorAppointmentRepository,
  doctorAvailabilityRepository,
  medicalRecordRepository,
  realtimePublisher
);

const getPatientOverViewUseCase = new GetPatientOverViewUseCase(
  patientProfileRepository,
  doctorAppointmentRepository,
  mongoUserRepository
);

const saveQuickNoteUseCase = new SaveQuickNoteUseCase(medicalRecordRepository);

const completeConsultationUsecase = new CompleteConsultationUseCase(
  doctorAppointmentRepository,
  medicalRecordRepository
);

const markAsNoShowUseCase = new MarkAsNoShowUseCase(doctorAppointmentRepository, realtimePublisher);

const getConsultationVideoTokenUseCase = new GetConsultationVideoTokenDoctorUseCase(
  consultationRepo,
  mongoUserRepository
);

const getActiveDoctorOnlineConsultationUseCase = new GetActiveDoctorOnlineConsultationUseCase(
  consultationRepo
);

const endConsultationOnlineUseCase = new EndConsultationOnlineUseCase(consultationRepo);

const doctorConsultationController = new DoctorConsultationController(
  startConsultationUseCase,
  getPatientOverViewUseCase,
  saveQuickNoteUseCase,
  completeConsultationUsecase,
  markAsNoShowUseCase,
  getConsultationVideoTokenUseCase,
  getActiveDoctorOnlineConsultationUseCase,
  endConsultationOnlineUseCase
);

export const doctorRoutes = new DoctorRoutes(
  doctorProfileMangementController,
  doctorAvailabilityController,
  doctorScheduleMangmentController,
  doctorAppointmentController,
  doctorConsultationController
);
