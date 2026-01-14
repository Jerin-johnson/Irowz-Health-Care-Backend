import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { DoctorBookingController } from "../controllers/patient/DoctorBooking.Controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { DoctorListingController } from "../controllers/patient/DoctorListing.Controller";
import { DoctorReviewController } from "../controllers/patient/DoctorReview.Controller";

export class PatientRoutes {
  private _router: Router;

  constructor(
    private readonly _DoctorBookingController: DoctorBookingController,
    private readonly _DoctorListingController: DoctorListingController,
    private readonly _DoctorReviewController: DoctorReviewController
  ) {
    this._router = Router();
  }

  register(): Router {
    this._router.get("/doctor/slot", asyncHandler(this._DoctorBookingController.GetAvailableSlots));
    this._router.post(
      "/doctor/slot/lock",
      authMiddleware,
      asyncHandler(this._DoctorBookingController.lockDoctorSlot)
    );
    this._router.post(
      "/doctor/slot/unlock",
      authMiddleware,
      asyncHandler(this._DoctorBookingController.unLockDoctorSlot)
    );

    //Doctor listing
    this._router.get(
      "/doctor/speciality",
      asyncHandler(this._DoctorListingController.getAllSpeciality)
    );

    this._router.get("/doctors", asyncHandler(this._DoctorListingController.searchDoctors));
    this._router.get("/doctor/:id", asyncHandler(this._DoctorListingController.getDoctorProfile));

    //get userBasic details for the checkout

    this._router.get(
      "/checkout/profile",
      authMiddleware,
      asyncHandler(this._DoctorBookingController.getPatientBasicDetailsForCheckout)
    );

    this._router.post(
      "/checkout",
      authMiddleware,
      asyncHandler(this._DoctorBookingController.checkout)
    );

    this._router.post(
      "/payment/verify",
      authMiddleware,
      asyncHandler(this._DoctorBookingController.verifyPayment)
    );

    //appointment success

    this._router.get(
      "/appointment/success/:id",
      authMiddleware,
      asyncHandler(this._DoctorBookingController.apponitmentSuccess)
    );

    // doctor reviews
    this._router.get(
      "/doctor/review/:id",
      authMiddleware,
      asyncHandler(this._DoctorReviewController.getDoctorReview)
    );

    this._router.post(
      "/doctor/review",
      authMiddleware,
      asyncHandler(this._DoctorReviewController.postReview)
    );

    return this._router;
  }
}
