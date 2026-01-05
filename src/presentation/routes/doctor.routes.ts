import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
// import { validate } from "../middlewares/validate.middleware";
import UserRoles from "../../domain/constants/UserRole";
import { authorizeRoles } from "../middlewares/role.middleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { DoctorProfileMangementController } from "../controllers/doctor/DoctorProfileMangement.Controller";
import { DoctorAvailabilityController } from "../controllers/doctor/DoctorAvailabilityController";
// import { enforcePasswordReset } from "../middlewares/enforcePasswordReset";

export class DoctorRoutes {
  private _router: Router;

  constructor(
    private readonly _DoctorProfileMangementController: DoctorProfileMangementController,
    private readonly _DoctorAvailabilityController: DoctorAvailabilityController
  ) {
    this._router = Router();
  }

  register(): Router {
    this._router.use(authMiddleware, authorizeRoles(UserRoles.DOCTOR));

    // this._router.use(enforcePasswordReset);
    this._router.get(
      "/profile",
      asyncHandler(this._DoctorProfileMangementController.getDoctorProfile)
    );

    this._router.patch(
      "/password",
      asyncHandler(this._DoctorProfileMangementController.resetDoctorPassword)
    );

    this._router.get("/availability", asyncHandler(this._DoctorAvailabilityController.get));
    this._router.post("/availability", asyncHandler(this._DoctorAvailabilityController.upsert));

    return this._router;
  }
}
