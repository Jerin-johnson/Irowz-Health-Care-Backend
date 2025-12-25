import { Router } from "express";
import UserRoles from "../../domain/constants/UserRole";
import { HospitalVerficationController } from "../controllers/superAdmin/HosptialVerfication.controller";
import { asyncHandler } from "../middlewares/asyncHandler";

export class SuperAdminRoutes {
  private router: Router;
  constructor(
    private HosptialVerifcationController: HospitalVerficationController
  ) {
    this.router = Router();
  }

  register(): Router {
    this.router.get(
      "/hospital-verifications",
      asyncHandler(this.HosptialVerifcationController.getAllVerficationRequest)
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
