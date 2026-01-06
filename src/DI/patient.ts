import { GetDoctorAvailabileSlotUseCase } from "../applications/usecases/patient/AvailableSlot/GetDoctorAvailableSlot.UseCase";
import { LockDoctorSlotUseCase } from "../applications/usecases/patient/BookingSlot/LockDoctorSlotUseCase";
import { DoctorBookingController } from "../presentation/controllers/patient/DoctorBooking.controller";
import { PatientRoutes } from "../presentation/routes/patient.routes";
import { redisDoctorAvailabilityCache } from "./cache";
import { redisDoctorSlotLockService } from "./lock";
import { doctorAppointmentRepository, doctorAvailabilityRepository } from "./repositers";

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

export const doctorBookingController = new DoctorBookingController(
  getDoctorAvailabileSlotUseCase,
  lockDoctorSlotUseCase
);

export const patientRoutes = new PatientRoutes(doctorBookingController);
