import { Router } from "express";
import { HospitalOnBoradingController } from "../controllers/hospital_onBoarding/HospitalOnboardingController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { licenseUpload } from "../middlewares/UploadPdfLiensches";
import { hospitalVerificationBodySchema } from "../validators/hosptial/HosptialVerfication";
import { validate } from "../middlewares/validate.middleware";
import { SpecialtyMangmentController } from "../controllers/hospitalAdmin/SpecialityMangment.Controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import UserRoles from "../../domain/constants/UserRole";
import { authorizeRoles } from "../middlewares/role.middleware";
export class HospitalAdminRoutes {
  private router: Router;

  constructor(
    private readonly HospitalOnBoradingController: HospitalOnBoradingController,
    private readonly SpecialtyMangmentController: SpecialtyMangmentController
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

    this.router.get(
      "/verification/status/:id",
      asyncHandler(this.HospitalOnBoradingController.checkStatusById)
    );

    this.router.use(authMiddleware, authorizeRoles(UserRoles.HOSPITAL_ADMIN));

    //speciality managment controller

    this.router.post(
      "/speciality",
      asyncHandler(this.SpecialtyMangmentController.createSpecilty)
    );

    this.router.get(
      "/speciality",
      asyncHandler(this.SpecialtyMangmentController.getAllHospital)
    );

    this.router.patch(
      "/speciality/:id",
      asyncHandler(this.SpecialtyMangmentController.editSpecialty)
    );

    this.router.patch(
      "/speciality/toggle/status",
      asyncHandler(this.SpecialtyMangmentController.BlockOrUnblockSpecialty)
    );

    return this.router;
  }
}
