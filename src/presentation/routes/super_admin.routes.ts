import { Router } from "express";
import UserRoles from "../../domain/constants/UserRole";
import { HospitalVerficationController } from "../controllers/superAdmin/HosptialVerfication.controller";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authMiddleware } from "../middlewares/authMiddleware";

export class SuperAdminRoutes {
  private router: Router;
  constructor(
    private HosptialVerifcationController: HospitalVerficationController
  ) {
    this.router = Router();
  }

  register(): Router {
    this.router.get(
      "/hospital-verifications/stats",
      asyncHandler(this.HosptialVerifcationController.getStats)
    );

    this.router.get(
      "/hospital-verifications",
      authMiddleware,
      asyncHandler(this.HosptialVerifcationController.getAllVerficationRequest)
    );

    this.router.get(
      "/hospital-verifications/:id",
      asyncHandler(this.HosptialVerifcationController.getVerficationRequestById)
    );

    this.router.patch(
      "/hospital-verifications/:hospitalId/approve",
      asyncHandler(this.HosptialVerifcationController.approve)
    );
    this.router.patch(
      "/hospital-verifications/:hospitalId/reject",
      asyncHandler(this.HosptialVerifcationController.reject)
    );

    return this.router;
  }
}
