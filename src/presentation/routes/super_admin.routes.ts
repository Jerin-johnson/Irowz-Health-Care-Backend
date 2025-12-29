import { Router } from "express";
import UserRoles from "../../domain/constants/UserRole";
import { HospitalVerficationController } from "../controllers/superAdmin/HosptialVerfication.controller";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authMiddleware } from "../middlewares/authMiddleware";
import { HospitalMangementController } from "../controllers/superAdmin/HosptialMangementController";

export class SuperAdminRoutes {
  private router: Router;
  constructor(
    private HosptialVerifcationController: HospitalVerficationController,
    private HospitalMangementController: HospitalMangementController
  ) {
    this.router = Router();
  }

  register(): Router {
    // hosptial verfication routes
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

    // hospital mangament routes;
    this.router.get(
      "/hospital",
      asyncHandler(this.HospitalMangementController.getAllHospital)
    );

    this.router.patch(
      "/hospital/toggle/status",
      asyncHandler(this.HospitalMangementController.BlockOrUnBlockHospital)
    );

    return this.router;
  }
}
