import { MarkAsNoShowUseCase } from "../applications/usecases/doctor/consultation/MarkAsNoShow.UseCase";
import { CancelAppointmentUseCase } from "../applications/usecases/patient/Appointments/CancelAppointment.useCase";
import { CheckCancelEligibilityUseCase } from "../applications/usecases/patient/Appointments/CheckCancelEligibilityUsecase";
import { CheckRescheduleEligibilityUseCase } from "../applications/usecases/patient/Appointments/CheckReschduleEligiblity.useCase";
import { GetPatientAppointmentsUseCase } from "../applications/usecases/patient/Appointments/GetAppointment.UseCase";
import { GetPatientQueueStatusUseCase } from "../applications/usecases/patient/Appointments/GetPatientQueueStatusUseCase";
import { RescheduleAppointmentUseCase } from "../applications/usecases/patient/Appointments/RescheduleAppointment.useCase";
import { GetDoctorAvailabileSlotUseCase } from "../applications/usecases/patient/AvailableSlot/GetDoctorAvailableSlot.UseCase";
import { ApponintmentSuccessOrFailureUseCase } from "../applications/usecases/patient/BookingSlot/ApponintmentSuccessOrFailure.useCase";
import { CheckoutUseCase } from "../applications/usecases/patient/BookingSlot/CheckoutUseCase";
import { GetPatientBasicDetailsForCheckoutUseCase } from "../applications/usecases/patient/BookingSlot/getPatientBasicDetailsForCheckout.UseCase";
import { HandleVerifyPayment } from "../applications/usecases/patient/BookingSlot/HandlePaymentWebhookUseCase";
import { LockDoctorSlotUseCase } from "../applications/usecases/patient/BookingSlot/LockDoctorSlotUseCase";
import { UnLockDoctorSlotUseCase } from "../applications/usecases/patient/BookingSlot/UnLockDoctorSlot.useCase";
import { GetConsultationVideoTokenPatientUseCase } from "../applications/usecases/patient/consultation/GetConsultationVideoTokenPatient";
import { RespondConsultationUseCase } from "../applications/usecases/patient/consultation/RespondConsultationUseCase";
import { GetPatientDashboardOverviewUseCase } from "../applications/usecases/patient/dashboard/GetPatientDashboardOverviewUseCase";
import { DoctorSearchUseCase } from "../applications/usecases/patient/DoctorListing/DoctorSearch.UseCase";
import { GetAvailableSpecialityUseCase } from "../applications/usecases/patient/DoctorListing/GetAvailbaleSpecialty.useCase";
import { GetDoctorProfileUseCase } from "../applications/usecases/patient/DoctorListing/GetDoctorProfile";
import { GetReviewUseCase } from "../applications/usecases/patient/DoctorReview/GetReviewUseCase";
import { PostReviewUseCase } from "../applications/usecases/patient/DoctorReview/PostReviewUseCase";
import { GetPatientLabTestsUseCase } from "../applications/usecases/patient/MedicalRecord/GetPatientLabReports";
import { GetMedicalHistoryPatientUseCase } from "../applications/usecases/patient/MedicalRecord/GetPatientMedicalRecord";
import { GetPatientPercriptionWithDoctorInfoUseCase } from "../applications/usecases/patient/MedicalRecord/GetPatientPrecriptionWithDoctorInfo.UseCase";
import { GetPatientNotifcationUseCase } from "../applications/usecases/patient/notification/PatientNotifcation";
import { EditPatientProfileUseCase } from "../applications/usecases/patient/ProfileAndSetting/EditPatientProfileUseCase";
import { GetProfileUseCase } from "../applications/usecases/patient/ProfileAndSetting/GetProfile.UseCase";
import { GetWalletUseCase } from "../applications/usecases/patient/wallet/GetWalletUseCase";
import { notificationRepo } from "../infrastructure/realTIme/realtimeConsumer";
import { DoctorBookingController } from "../presentation/controllers/patient/DoctorBooking.Controller";
import { DoctorListingController } from "../presentation/controllers/patient/DoctorListing.Controller";
import { DoctorReviewController } from "../presentation/controllers/patient/DoctorReview.Controller";
import { MedicalRecordPatientController } from "../presentation/controllers/patient/MedicalRecordPatient.Controller";
import { PatientAppointmentController } from "../presentation/controllers/patient/PatientAppointment.Controller";
import { PatientDashboardController } from "../presentation/controllers/patient/PatientDashboardController";
import { PatientNotificationController } from "../presentation/controllers/patient/PatientNotifcation.Controller";
import { PatientOnlineConsultationController } from "../presentation/controllers/patient/PatientOnlineConsultation.Controller";
import { PatientProfileController } from "../presentation/controllers/patient/PatientProfile.Controller";
// import { DoctorBookingController } from "../presentation/controllers/patient/DoctorBooking.controller";
import { PatientRoutes } from "../presentation/routes/patient.routes";
import { redisDoctorAvailabilityCache, redisDoctorSpecialityCache } from "./cache";
import { redisDoctorSlotLockService } from "./lock";
import { realtimePublisher } from "./realtime";
import {
  consultationRepo,
  doctorAppointmentRepository,
  doctorAvailabilityRepository,
  doctorRepo,
  doctorReviewRepository,
  doctorSearchMongoRepository,
  hospitalSpecialityRepo,
  medicalRecordRepository,
  mongoUserRepository,
  patientDashboardRepository,
  patientProfileRepository,
  walletRepo,
} from "./repositers";
import {
  paymentProviderFactory,
  razorpayGateway,
  s3FileStorage,
  sharpImageProcessor,
} from "./service";

export const getDoctorAvailabileSlotUseCase = new GetDoctorAvailabileSlotUseCase(
  doctorAvailabilityRepository,
  doctorAppointmentRepository,
  redisDoctorAvailabilityCache,
  redisDoctorSlotLockService
);

export const lockDoctorSlotUseCase = new LockDoctorSlotUseCase(
  redisDoctorSlotLockService,
  redisDoctorAvailabilityCache
);

export const unLockDoctorSlotUseCase = new UnLockDoctorSlotUseCase(
  redisDoctorSlotLockService,
  redisDoctorAvailabilityCache
);

const getPatientBasicDetailsForCheckoutUseCase = new GetPatientBasicDetailsForCheckoutUseCase(
  mongoUserRepository,
  doctorRepo
);

export const checkoutUseCase = new CheckoutUseCase(
  redisDoctorSlotLockService,
  doctorAppointmentRepository,
  paymentProviderFactory,
  doctorRepo
);

const handleVerifyPayment = new HandleVerifyPayment(
  razorpayGateway,
  doctorAppointmentRepository,
  redisDoctorAvailabilityCache,
  realtimePublisher
);

const apponintmentSuccessOrFailureUseCase = new ApponintmentSuccessOrFailureUseCase(
  doctorAppointmentRepository,
  doctorRepo
);

export const doctorBookingController = new DoctorBookingController(
  getDoctorAvailabileSlotUseCase,
  lockDoctorSlotUseCase,
  unLockDoctorSlotUseCase,
  getPatientBasicDetailsForCheckoutUseCase,
  checkoutUseCase,
  handleVerifyPayment,
  apponintmentSuccessOrFailureUseCase
);

export const doctorSearchUseCase = new DoctorSearchUseCase(
  doctorSearchMongoRepository,
  doctorAvailabilityRepository
);

export const getAvailableSpecialityUseCase = new GetAvailableSpecialityUseCase(
  hospitalSpecialityRepo,
  redisDoctorSpecialityCache
);

const getDoctorProfileUseCase = new GetDoctorProfileUseCase(doctorRepo);

export const doctorListingController = new DoctorListingController(
  getAvailableSpecialityUseCase,
  doctorSearchUseCase,
  getDoctorProfileUseCase
);

const postReviewUseCase = new PostReviewUseCase(doctorReviewRepository, doctorRepo);

const getReviewUseCase = new GetReviewUseCase(doctorReviewRepository);

const doctorReviewController = new DoctorReviewController(postReviewUseCase, getReviewUseCase);

export const getProfileUseCase = new GetProfileUseCase(
  patientProfileRepository,
  mongoUserRepository
);

const editPatientProfileUseCase = new EditPatientProfileUseCase(
  mongoUserRepository,
  patientProfileRepository,
  s3FileStorage,
  sharpImageProcessor
);

const getWalletUseCase = new GetWalletUseCase(walletRepo);

const patientProfileController = new PatientProfileController(
  getProfileUseCase,
  editPatientProfileUseCase,
  getWalletUseCase
);

const getPatientQueueStatusUseCase = new GetPatientQueueStatusUseCase(
  doctorAvailabilityRepository,
  doctorAppointmentRepository
);

const getPatientAppointmentsUseCase = new GetPatientAppointmentsUseCase(
  doctorAppointmentRepository
);

const checkCancelEligibilityUseCase = new CheckCancelEligibilityUseCase(
  doctorAppointmentRepository
);
const cancelAppointmentUseCase = new CancelAppointmentUseCase(
  doctorAppointmentRepository,
  walletRepo
);

const checkRescheduleEligibilityUseCase = new CheckRescheduleEligibilityUseCase(
  doctorAppointmentRepository
);

const rescheduleAppointmentUseCase = new RescheduleAppointmentUseCase(
  doctorAppointmentRepository,
  walletRepo,
  redisDoctorSlotLockService
);

const patientAppointmentController = new PatientAppointmentController(
  getPatientQueueStatusUseCase,
  getPatientAppointmentsUseCase,
  cancelAppointmentUseCase,
  checkCancelEligibilityUseCase,
  checkRescheduleEligibilityUseCase,
  rescheduleAppointmentUseCase
);

const getPatientNotifcationUseCase = new GetPatientNotifcationUseCase(notificationRepo);
const patientNotificationController = new PatientNotificationController(
  getPatientNotifcationUseCase
);

const getConsultationVideoTokenPatientUseCase = new GetConsultationVideoTokenPatientUseCase(
  consultationRepo
);

const markAsNoShowUseCase = new MarkAsNoShowUseCase(doctorAppointmentRepository, realtimePublisher);

const respondConsultationUseCase = new RespondConsultationUseCase(
  consultationRepo,
  markAsNoShowUseCase,
  realtimePublisher
);

const patientOnlineConsultationController = new PatientOnlineConsultationController(
  respondConsultationUseCase,
  getConsultationVideoTokenPatientUseCase
);

const getPatientDashboardOverviewUseCase = new GetPatientDashboardOverviewUseCase(
  patientDashboardRepository
);

const patientDashboardController = new PatientDashboardController(
  getPatientDashboardOverviewUseCase
);

const getMedicalHistoryPatientUseCase = new GetMedicalHistoryPatientUseCase(
  medicalRecordRepository
);

const getPatientPercriptionWithDoctorInfoUseCase = new GetPatientPercriptionWithDoctorInfoUseCase(
  medicalRecordRepository
);

const getPatientLabTestsUseCase = new GetPatientLabTestsUseCase(medicalRecordRepository);

const medicalRecordPatientController = new MedicalRecordPatientController(
  getMedicalHistoryPatientUseCase,
  getPatientPercriptionWithDoctorInfoUseCase,
  getPatientLabTestsUseCase
);

export const patientRoutes = new PatientRoutes(
  doctorBookingController,
  doctorListingController,
  doctorReviewController,
  patientProfileController,
  patientAppointmentController,
  patientNotificationController,
  patientOnlineConsultationController,
  patientDashboardController,
  medicalRecordPatientController
);
