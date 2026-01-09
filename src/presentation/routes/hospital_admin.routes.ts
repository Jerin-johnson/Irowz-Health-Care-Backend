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
    private readonly _HospitalOnBoradingController: HospitalOnBoradingController,
    private readonly _SpecialtyMangmentController: SpecialtyMangmentController,
    private readonly _DoctorMangmentController: DoctorMangmentController
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
      asyncHandler(this._HospitalOnBoradingController.submitVerficationRequest)
    );

    this.router.post(
      "/verification/reapply/:id",
      licenseUpload.single("licenseDocument"),
      (req, res, next) => {
        console.log(req.body);
        console.log(req.file);
        next();
      },
      asyncHandler(this._HospitalOnBoradingController.ressubmitVerficationRequest)
    );

    this.router.get(
      "/verification/status/:id",
      asyncHandler(this._HospitalOnBoradingController.checkStatusById)
    );

    this.router.use(authMiddleware, authorizeRoles(UserRoles.HOSPITAL_ADMIN));

    //speciality managment controller

    this.router.post("/speciality", asyncHandler(this._SpecialtyMangmentController.createSpecilty));

    this.router.get(
      "/speciality",
      asyncHandler(this._SpecialtyMangmentController.getAllHospitalSpeciality)
    );

    this.router.get(
      "/speciality/names",
      asyncHandler(this._SpecialtyMangmentController.GetAllSpecialtyName)
    );

    this.router.patch(
      "/speciality/:id",
      asyncHandler(this._SpecialtyMangmentController.editSpecialty)
    );

    this.router.patch(
      "/speciality/toggle/status",
      asyncHandler(this._SpecialtyMangmentController.BlockOrUnblockSpecialty)
    );

    //Doctor Mangement

    this.router.post(
      "/doctor",
      validate(AdminCreateDoctorSchema),
      asyncHandler(this._DoctorMangmentController.createDoctor)
    );

    this.router.get("/doctor", asyncHandler(this._DoctorMangmentController.getDoctors));

    this.router.patch(
      "/doctor/toggle/status",
      asyncHandler(this._DoctorMangmentController.BlockOrUnblockDoctor)
    );

    return this.router;
  }
}
