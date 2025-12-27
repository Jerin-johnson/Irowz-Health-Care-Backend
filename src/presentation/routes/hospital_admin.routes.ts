import { Router } from "express";
import { HospitalOnBoradingController } from "../controllers/hospital_onBoarding/HospitalOnboardingController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { licenseUpload } from "../middlewares/UploadPdfLiensches";
import { hospitalVerificationBodySchema } from "../validators/hosptial/HosptialVerfication";
import { validate } from "../middlewares/validate.middleware";
export class HospitalAdminRoutes {
  private router: Router;

  constructor(
    private readonly HospitalOnBoradingController: HospitalOnBoradingController
  ) {
    this.router = Router();
  }

  register(): Router {
    this.router.post(
      "/verification",
      licenseUpload.single("licenseDocument"),
      (req, res, next) => {
        console.log(req.body);
        console.log(req.file);
        next();
      },
      validate(hospitalVerificationBodySchema),
      asyncHandler(this.HospitalOnBoradingController.submitVerficationRequest)
    );

    return this.router;
  }
}
