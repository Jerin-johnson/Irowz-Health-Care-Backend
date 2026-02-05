import { Router } from "express";
import UserRoles from "../../domain/constants/UserRole";
import { HospitalVerficationController } from "../controllers/superAdmin/HosptialVerfication.controller";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authMiddleware } from "../middlewares/authMiddleware";
import { HospitalMangementController } from "../controllers/superAdmin/HosptialMangementController";
import { authorizeRoles } from "../middlewares/role.middleware";
import { SUPER_ADMIN_ROUTES } from "../constants/routes/super-admin.constants.routes";
import { SubscriptionController } from "../controllers/superAdmin/SubscriptionController";
import { SubscriptionSchema } from "../validators/superadmin/subscription.validator";
import { validate } from "../middlewares/validate.middleware";

export class SuperAdminRoutes {
  private router: Router;

  constructor(
    private readonly HosptialVerifcationController: HospitalVerficationController,
    private readonly HospitalMangementController: HospitalMangementController,
    private readonly SubscriptionController: SubscriptionController
  ) {
    this.router = Router();
  }

  register(): Router {
    // -------- AUTH + ROLE GUARD --------
    this.router.use(authMiddleware, authorizeRoles(UserRoles.SUPER_ADMIN));

    // -------- Hospital verification --------
    this.router.get(
      SUPER_ADMIN_ROUTES.HOSPITAL_VERIFICATION_STATS,
      asyncHandler(this.HosptialVerifcationController.getStats)
    );

    this.router.get(
      SUPER_ADMIN_ROUTES.HOSPITAL_VERIFICATIONS,
      asyncHandler(this.HosptialVerifcationController.getAllVerficationRequest)
    );

    this.router.get(
      SUPER_ADMIN_ROUTES.HOSPITAL_LICENSE_VIEW,
      asyncHandler(this.HosptialVerifcationController.viewLinencsenDocs)
    );

    this.router.get(
      SUPER_ADMIN_ROUTES.HOSPITAL_VERIFICATION_BY_ID,
      asyncHandler(this.HosptialVerifcationController.getVerficationRequestById)
    );

    this.router.patch(
      SUPER_ADMIN_ROUTES.HOSPITAL_APPROVE,
      asyncHandler(this.HosptialVerifcationController.approve)
    );

    this.router.patch(
      SUPER_ADMIN_ROUTES.HOSPITAL_REJECT,
      asyncHandler(this.HosptialVerifcationController.reject)
    );

    // -------- Hospital management --------
    this.router.get(
      SUPER_ADMIN_ROUTES.HOSPITAL,
      asyncHandler(this.HospitalMangementController.getAllHospital)
    );

    this.router.patch(
      SUPER_ADMIN_ROUTES.HOSPITAL_TOGGLE_STATUS,
      asyncHandler(this.HospitalMangementController.BlockOrUnBlockHospital)
    );

    this.router.post(
      "/subscription",
      validate(SubscriptionSchema),
      asyncHandler(this.SubscriptionController.createSubscriptionPlan)
    );

    this.router.get("/subscription", asyncHandler(this.SubscriptionController.getSubscriptionPlan));
    this.router.patch(
      "/subscription/toggle/:id",
      asyncHandler(this.SubscriptionController.ToggleSubscription)
    );
    this.router.delete(
      "/subscription/:id",
      asyncHandler(this.SubscriptionController.deleteSubscription)
    );
    return this.router;
  }
}
