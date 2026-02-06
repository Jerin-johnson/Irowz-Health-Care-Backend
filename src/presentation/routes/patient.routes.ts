import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { DoctorBookingController } from "../controllers/patient/DoctorBooking.Controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { DoctorListingController } from "../controllers/patient/DoctorListing.Controller";
import { DoctorReviewController } from "../controllers/patient/DoctorReview.Controller";
import { PATIENT_ROUTES } from "../constants/routes/patient.constants.routes";
import { PatientProfileController } from "../controllers/patient/PatientProfile.Controller";
import { profileImageUpload } from "../middlewares/profileImage.upload";
import { validate } from "../middlewares/validate.middleware";
import { patientProfileSchema } from "../validators/patient/PatientProfileSchme";
import { PatientAppointmentController } from "../controllers/patient/PatientAppointment.Controller";
import { PatientNotificationController } from "../controllers/patient/PatientNotifcation.Controller";
import { PatientOnlineConsultationController } from "../controllers/patient/PatientOnlineConsultation.Controller";
import { PatientDashboardController } from "../controllers/patient/PatientDashboardController";

export class PatientRoutes {
  private _router: Router;

  constructor(
    private readonly _DoctorBookingController: DoctorBookingController,
    private readonly _DoctorListingController: DoctorListingController,
    private readonly _DoctorReviewController: DoctorReviewController,
    private readonly _PatientProfileController: PatientProfileController,
    private readonly _PatientAppointmentController: PatientAppointmentController,
    private readonly _PatientNotificationController: PatientNotificationController,
    private readonly _PatientOnlineConsultationController: PatientOnlineConsultationController,
    private readonly _PatientDashboardController: PatientDashboardController
  ) {
    this._router = Router();
  }

  register(): Router {
    // -------- Doctor slots --------
    this._router.get(
      PATIENT_ROUTES.DOCTOR_SLOT,
      asyncHandler(this._DoctorBookingController.GetAvailableSlots)
    );

    this._router.post(
      PATIENT_ROUTES.DOCTOR_SLOT_LOCK,
      authMiddleware,
      asyncHandler(this._DoctorBookingController.lockDoctorSlot)
    );

    this._router.post(
      PATIENT_ROUTES.DOCTOR_SLOT_UNLOCK,
      authMiddleware,
      asyncHandler(this._DoctorBookingController.unLockDoctorSlot)
    );

    // -------- Doctor listing --------
    this._router.get(
      PATIENT_ROUTES.DOCTOR_SPECIALITY,
      asyncHandler(this._DoctorListingController.getAllSpeciality)
    );

    this._router.get(
      PATIENT_ROUTES.DOCTORS,
      asyncHandler(this._DoctorListingController.searchDoctors)
    );

    this._router.get(
      PATIENT_ROUTES.DOCTOR_PROFILE,
      asyncHandler(this._DoctorListingController.getDoctorProfile)
    );

    // -------- Checkout --------
    this._router.get(
      PATIENT_ROUTES.CHECKOUT_PROFILE,
      authMiddleware,
      asyncHandler(this._DoctorBookingController.getPatientBasicDetailsForCheckout)
    );

    this._router.post(
      PATIENT_ROUTES.CHECKOUT,
      authMiddleware,
      asyncHandler(this._DoctorBookingController.checkout)
    );

    this._router.post(
      PATIENT_ROUTES.PAYMENT_VERIFY,
      authMiddleware,
      asyncHandler(this._DoctorBookingController.verifyPayment)
    );

    // -------- Doctor reviews --------
    this._router.get(
      PATIENT_ROUTES.DOCTOR_REVIEW_BY_ID,
      authMiddleware,
      asyncHandler(this._DoctorReviewController.getDoctorReview)
    );

    this._router.post(
      PATIENT_ROUTES.DOCTOR_REVIEW,
      authMiddleware,
      asyncHandler(this._DoctorReviewController.postReview)
    );

    // -------- Patient Profile --------

    this._router.get(
      "/profile",
      authMiddleware,
      asyncHandler(this._PatientProfileController.getProfile)
    );

    this._router.patch(
      "/profile",
      authMiddleware,
      profileImageUpload.single("profileImage"),
      (req, res, next) => {
        console.log("the req.body is ", req.body);
        next();
      },
      validate(patientProfileSchema),
      asyncHandler(this._PatientProfileController.editProfile)
    );

    this._router.get("/wallet", authMiddleware, this._PatientProfileController.getMyWallet);

    // // -------- Appointment --------\\

    this._router.get(
      "/appointments",
      authMiddleware,
      asyncHandler(this._PatientAppointmentController.getAppointments)
    );

    this._router.get(
      PATIENT_ROUTES.APPOINTMENT_SUCCESS,
      authMiddleware,
      asyncHandler(this._DoctorBookingController.apponitmentSuccess)
    );

    this._router.get(
      "/appointment/cancel-eligibility/:id",
      authMiddleware,
      asyncHandler(this._PatientAppointmentController.checkCancelEligibility)
    );

    this._router.post(
      "/appointment/cancel/:id",
      authMiddleware,
      asyncHandler(this._PatientAppointmentController.CancelAppointment)
    );

    this._router.get(
      "/appointment/reschedule-eligibility/:id",
      authMiddleware,
      asyncHandler(this._PatientAppointmentController.checkRescheduleEligibility)
    );

    this._router.post(
      "/appointment/reschedule/:id",
      authMiddleware,
      asyncHandler(this._PatientAppointmentController.rescheduleAppointment)
    );

    //live queue
    this._router.get(
      "/live/queue/:id",
      authMiddleware,
      asyncHandler(this._PatientAppointmentController.getLiveQueue)
    );

    //Notification

    this._router.get(
      "/notification",
      authMiddleware,
      asyncHandler(this._PatientNotificationController.get)
    );

    // online consultation

    this._router.post(
      "/consultation/respond",
      authMiddleware,
      asyncHandler(this._PatientOnlineConsultationController.RespondToCall)
    );

    this._router.post(
      "/video/token",
      authMiddleware,
      asyncHandler(this._PatientOnlineConsultationController.videoToken)
    );

    //dashboard

    this._router.get(
      "/dashboard/overview",
      authMiddleware,
      asyncHandler(this._PatientDashboardController.overview)
    );

    return this._router;
  }
}
