import { GetDoctorAvailabileSlotUseCase } from "../applications/usecases/patient/AvailableSlot/GetDoctorAvailableSlot.UseCase";
import { ApponintmentSuccessOrFailureUseCase } from "../applications/usecases/patient/BookingSlot/ApponintmentSuccessOrFailure.useCase";
import { CheckoutUseCase } from "../applications/usecases/patient/BookingSlot/CheckoutUseCase";
import { GetPatientBasicDetailsForCheckoutUseCase } from "../applications/usecases/patient/BookingSlot/getPatientBasicDetailsForCheckout.UseCase";
import { HandleVerifyPayment } from "../applications/usecases/patient/BookingSlot/HandlePaymentWebhookUseCase";
import { LockDoctorSlotUseCase } from "../applications/usecases/patient/BookingSlot/LockDoctorSlotUseCase";
import { UnLockDoctorSlotUseCase } from "../applications/usecases/patient/BookingSlot/UnLockDoctorSlot.useCase";
import { DoctorSearchUseCase } from "../applications/usecases/patient/DoctorListing/DoctorSearch.UseCase";
import { GetAvailableSpecialityUseCase } from "../applications/usecases/patient/DoctorListing/GetAvailbaleSpecialty.useCase";
import { GetDoctorProfileUseCase } from "../applications/usecases/patient/DoctorListing/GetDoctorProfile";
import { DoctorBookingController } from "../presentation/controllers/patient/DoctorBooking.Controller";
import { DoctorListingController } from "../presentation/controllers/patient/DoctorListing.Controller";
// import { DoctorBookingController } from "../presentation/controllers/patient/DoctorBooking.controller";
import { PatientRoutes } from "../presentation/routes/patient.routes";
import { redisDoctorAvailabilityCache, redisDoctorSpecialityCache } from "./cache";
import { redisDoctorSlotLockService } from "./lock";
import {
  doctorAppointmentRepository,
  doctorAvailabilityRepository,
  doctorRepo,
  doctorSearchMongoRepository,
  hospitalSpecialityRepo,
  mongoUserRepository,
} from "./repositers";
import { razorpayGateway } from "./service";

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

const unLockDoctorSlotUseCase = new UnLockDoctorSlotUseCase(
  redisDoctorSlotLockService,
  redisDoctorAvailabilityCache
);

const getPatientBasicDetailsForCheckoutUseCase = new GetPatientBasicDetailsForCheckoutUseCase(
  mongoUserRepository,
  doctorRepo
);

const checkoutUseCase = new CheckoutUseCase(
  redisDoctorSlotLockService,
  doctorAppointmentRepository,
  razorpayGateway,
  doctorRepo
);

const handleVerifyPayment = new HandleVerifyPayment(
  razorpayGateway,
  doctorAppointmentRepository,
  redisDoctorAvailabilityCache
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

const doctorSearchUseCase = new DoctorSearchUseCase(
  doctorSearchMongoRepository,
  doctorAvailabilityRepository
);

const getAvailableSpecialityUseCase = new GetAvailableSpecialityUseCase(
  hospitalSpecialityRepo,
  redisDoctorSpecialityCache
);

const getDoctorProfileUseCase = new GetDoctorProfileUseCase(doctorRepo);

const doctorListingController = new DoctorListingController(
  getAvailableSpecialityUseCase,
  doctorSearchUseCase,
  getDoctorProfileUseCase
);

export const patientRoutes = new PatientRoutes(doctorBookingController, doctorListingController);
