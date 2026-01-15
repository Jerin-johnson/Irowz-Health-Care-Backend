import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import UserRoles from "../../domain/constants/UserRole";
import { authorizeRoles } from "../middlewares/role.middleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { DoctorProfileMangementController } from "../controllers/doctor/DoctorProfileMangement.Controller";
import { DoctorAvailabilityController } from "../controllers/doctor/DoctorAvailabilityController";
import { profileImageUpload } from "../middlewares/profileImage.upload";
import { DOCTOR_ROUTES } from "../constants/routes/doctor.constants.routes";

export class DoctorRoutes {
  private _router: Router;

  constructor(
    private readonly _DoctorProfileMangementController: DoctorProfileMangementController,
    private readonly _DoctorAvailabilityController: DoctorAvailabilityController
  ) {
    this._router = Router();
  }

  register(): Router {
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
      DOCTOR_ROUTES.AVAILABILITY,
      asyncHandler(this._DoctorAvailabilityController.upsert)
    );

    return this._router;
  }
}
