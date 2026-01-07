import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { DoctorBookingController } from "../controllers/patient/DoctorBooking.Controller";
import { authMiddleware } from "../middlewares/authMiddleware";

export class PatientRoutes {
  private _router: Router;

  constructor(private readonly _DoctorBookingController: DoctorBookingController) {
    this._router = Router();
  }

  register(): Router {
    this._router.get("/doctor/slot", asyncHandler(this._DoctorBookingController.GetAvailableSlots));
    this._router.post(
      "/doctor/slot/lock",
      authMiddleware,
      asyncHandler(this._DoctorBookingController.lockDoctorSlot)
    );

    return this._router;
  }
}
