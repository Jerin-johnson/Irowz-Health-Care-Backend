import { Router } from "express";
import { HospitalOnBoradingController } from "../controllers/hospital_onBoarding/HospitalOnboardingController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema } from "../validators/auth/login.schema";
import UserRoles from "../../domain/constants/UserRole";
import { licenseUpload } from "../middlewares/UploadPdfLiensches";
export class HospitalAdminRoutes {
  private router: Router;

  constructor(
    private readonly HospitalOnBoradingController: HospitalOnBoradingController
  ) {
    this.router = Router();
  }

  register(): Router {
    // this.router.post(
    //   "/login",
    //   validate(loginSchema)
    //   // asyncHandler(this.authController.login([UserRoles.PATIENT]))
    // );

    this.router.post(
      "/verification",
      licenseUpload.single("licenseDocument"),
      //   validate(registerSchema),
      asyncHandler(this.HospitalOnBoradingController.submitVerficationRequest)
    );

    return this.router;
  }
}
