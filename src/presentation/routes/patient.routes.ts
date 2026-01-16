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

export class PatientRoutes {
  private _router: Router;

  constructor(
    private readonly _DoctorBookingController: DoctorBookingController,
    private readonly _DoctorListingController: DoctorListingController,
    private readonly _DoctorReviewController: DoctorReviewController,
    private readonly _PatientProfileController: PatientProfileController
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

    // -------- Appointment --------
    this._router.get(
      PATIENT_ROUTES.APPOINTMENT_SUCCESS,
      authMiddleware,
      asyncHandler(this._DoctorBookingController.apponitmentSuccess)
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

    return this._router;
  }
}
