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
import { DoctorMangmentController } from "../controllers/hospitalAdmin/DoctorMangment.Controller";
import { AdminCreateDoctorSchema } from "../validators/hosptial/AdminCreateDoctor";
export class HospitalAdminRoutes {
  private router: Router;

  constructor(
    private readonly HospitalOnBoradingController: HospitalOnBoradingController,
    private readonly SpecialtyMangmentController: SpecialtyMangmentController,
    private readonly DoctorMangmentController: DoctorMangmentController
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

    this.router.get(
      "/speciality/names",
      asyncHandler(this.SpecialtyMangmentController.GetAllSpecialtyName)
    );

    this.router.patch(
      "/speciality/:id",
      asyncHandler(this.SpecialtyMangmentController.editSpecialty)
    );

    this.router.patch(
      "/speciality/toggle/status",
      asyncHandler(this.SpecialtyMangmentController.BlockOrUnblockSpecialty)
    );

    //Doctor Mangement

    this.router.post(
      "/doctor",
      validate(AdminCreateDoctorSchema),
      asyncHandler(this.DoctorMangmentController.createDoctor)
    );

    this.router.get(
      "/doctor",
      asyncHandler(this.DoctorMangmentController.getDoctors)
    );

    this.router.patch(
      "/doctor/toggle/status",
      asyncHandler(this.DoctorMangmentController.BlockOrUnblockDoctor)
    );

    return this.router;
  }
}
