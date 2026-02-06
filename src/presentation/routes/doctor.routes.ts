import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import UserRoles from "../../domain/constants/UserRole";
import { authorizeRoles } from "../middlewares/role.middleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { DoctorProfileMangementController } from "../controllers/doctor/DoctorProfileMangement.Controller";
import { DoctorAvailabilityController } from "../controllers/doctor/DoctorAvailabilityController";
import { profileImageUpload } from "../middlewares/profileImage.upload";
import { DOCTOR_ROUTES } from "../constants/routes/doctor.constants.routes";
import { DoctorScheduleMangmentController } from "../controllers/doctor/DoctorScheduleMangment.Controller";
import { DoctorAppointmentController } from "../controllers/doctor/DoctorAppoinmentController";
import { DoctorConsultationController } from "../controllers/doctor/DoctorConsultation.Controller";
import { DoctorDashboardController } from "../controllers/doctor/DoctorDashboardController";

export class DoctorRoutes {
  private _router: Router;

  constructor(
    private readonly _DoctorProfileMangementController: DoctorProfileMangementController,
    private readonly _DoctorAvailabilityController: DoctorAvailabilityController,
    private readonly _DoctorScheduleMangmentController: DoctorScheduleMangmentController,
    private readonly _DoctorAppointmentController: DoctorAppointmentController,
    private readonly _DoctorConsultationController: DoctorConsultationController,
    private readonly _DoctorDashboardController: DoctorDashboardController
  ) {
    this._router = Router();
  }

  register(): Router {
    // global and reused by the patient
    this._router.get(
      "/appointment/:id",
      asyncHandler(this._DoctorAppointmentController.getAppointmentById)
    );

    // Auth + Role guard
    this._router.use(authMiddleware, authorizeRoles(UserRoles.DOCTOR));

    // Profile
    this._router.get(
      DOCTOR_ROUTES.PROFILE,
      asyncHandler(this._DoctorProfileMangementController.getDoctorProfile)
    );

    this._router.patch(
      DOCTOR_ROUTES.PROFILE,
      profileImageUpload.single("profileImage"),
      asyncHandler(this._DoctorProfileMangementController.editDoctorProfile)
    );

    // Password
    this._router.patch(
      DOCTOR_ROUTES.PASSWORD,
      asyncHandler(this._DoctorProfileMangementController.resetDoctorPassword)
    );

    // Availability
    this._router.get(
      DOCTOR_ROUTES.AVAILABILITY,
      asyncHandler(this._DoctorAvailabilityController.get)
    );

    this._router.post(
      "/availability/check",
      asyncHandler(this._DoctorAvailabilityController.checkEditConfilt)
    );

    this._router.post(
      DOCTOR_ROUTES.AVAILABILITY,
      asyncHandler(this._DoctorAvailabilityController.upsert)
    );

    this._router.patch(
      "/availability/confirm",
      asyncHandler(this._DoctorAvailabilityController.confirmAvailabilityChange)
    );

    this._router.get("/schedule", asyncHandler(this._DoctorScheduleMangmentController.getSlots));
    this._router.post(
      "/schedule/lock",
      asyncHandler(this._DoctorScheduleMangmentController.blockSlots)
    );

    // Queue and consulation module

    this._router.get("/queue", asyncHandler(this._DoctorAppointmentController.getLiveQueue));

    //consutlation controller
    this._router.post(
      `/consultation/start/patient/quicknote/:id`,
      asyncHandler(this._DoctorConsultationController.saveQuickObservationNote)
    );

    this._router.post(
      "/consultation/start/:appointmentId",
      asyncHandler(this._DoctorConsultationController.startConsultation)
    );

    this._router.get(
      "/consultation/medical-record/:recordId",
      asyncHandler(this._DoctorConsultationController.GetMedicalRecordWithDoctorInfoUseCase)
    );

    this._router.get(
      "/consultation/start/patient/overview/:id",
      asyncHandler(this._DoctorConsultationController.getPatientOverviewForConsulation)
    );

    this._router.get(
      "/consultation/start/patient/medical-history/:id",
      asyncHandler(this._DoctorConsultationController.GetMedicalHistory)
    );

    this._router.post(
      `/consultation/start/patient/prescription/:id`,
      asyncHandler(this._DoctorConsultationController.savePercritption)
    );

    this._router.post(
      "/consultation/complete/:appointmentId",
      asyncHandler(this._DoctorConsultationController.completeConsultation)
    );

    this._router.post(
      "/consultation/no-show/:appointmentId",
      asyncHandler(this._DoctorConsultationController.MarkAsNoShow)
    );

    this._router.post(
      "/video/token",
      asyncHandler(this._DoctorConsultationController.getVideoToken)
    );

    this._router.get(
      "/consultation/active/online",
      asyncHandler(this._DoctorConsultationController.getActiveDoctorConsultation)
    );

    this._router.post(
      "/consultation/online/end",
      asyncHandler(this._DoctorConsultationController.EndConsultationOnline)
    );

    //dashboard

    this._router.get("/dashboard/overview", asyncHandler(this._DoctorDashboardController.overview));

    return this._router;
  }
}
