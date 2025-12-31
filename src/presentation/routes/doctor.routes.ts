import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validate } from "../middlewares/validate.middleware";
import UserRoles from "../../domain/constants/UserRole";
import { authorizeRoles } from "../middlewares/role.middleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { DoctorProfileMangementController } from "../controllers/doctor/DoctorProfileMangement.Controller";
import { enforcePasswordReset } from "../middlewares/enforcePasswordReset";

export class DoctorRoutes {
  private _router: Router;

  constructor(
    private readonly _DoctorProfileMangementController: DoctorProfileMangementController
  ) {
    this._router = Router();
  }

  register(): Router {
    this._router.use(authMiddleware, authorizeRoles(UserRoles.DOCTOR));

    // this._router.use(enforcePasswordReset);
    this._router.get(
      "/profile",
      this._DoctorProfileMangementController.getDoctorProfile
    );

    return this._router;
  }
}
