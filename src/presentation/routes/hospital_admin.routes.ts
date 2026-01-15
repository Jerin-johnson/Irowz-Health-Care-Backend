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
import { HOSPITAL_ADMIN_ROUTES } from "../constants/routes/hospital-admin.constants.routes";

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
      HOSPITAL_ADMIN_ROUTES.VERIFICATION,
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
      HOSPITAL_ADMIN_ROUTES.VERIFICATION_REAPPLY,
      licenseUpload.single("licenseDocument"),
      (req, res, next) => {
        console.log(req.body);
        console.log(req.file);
        next();
      },
      asyncHandler(this._HospitalOnBoradingController.ressubmitVerficationRequest)
    );

    this.router.get(
      HOSPITAL_ADMIN_ROUTES.VERIFICATION_STATUS,
      asyncHandler(this._HospitalOnBoradingController.checkStatusById)
    );

    // -------- AUTH + ROLE GUARD --------
    this.router.use(authMiddleware, authorizeRoles(UserRoles.HOSPITAL_ADMIN));

    // -------- Speciality management --------
    this.router.post(
      HOSPITAL_ADMIN_ROUTES.SPECIALITY,
      asyncHandler(this._SpecialtyMangmentController.createSpecilty)
    );

    this.router.get(
      HOSPITAL_ADMIN_ROUTES.SPECIALITY,
      asyncHandler(this._SpecialtyMangmentController.getAllHospitalSpeciality)
    );

    this.router.get(
      HOSPITAL_ADMIN_ROUTES.SPECIALITY_NAMES,
      asyncHandler(this._SpecialtyMangmentController.GetAllSpecialtyName)
    );

    this.router.patch(
      HOSPITAL_ADMIN_ROUTES.SPECIALITY_BY_ID,
      asyncHandler(this._SpecialtyMangmentController.editSpecialty)
    );

    this.router.patch(
      HOSPITAL_ADMIN_ROUTES.SPECIALITY_TOGGLE_STATUS,
      asyncHandler(this._SpecialtyMangmentController.BlockOrUnblockSpecialty)
    );

    // -------- Doctor management --------
    this.router.post(
      HOSPITAL_ADMIN_ROUTES.DOCTOR,
      validate(AdminCreateDoctorSchema),
      asyncHandler(this._DoctorMangmentController.createDoctor)
    );

    this.router.get(
      HOSPITAL_ADMIN_ROUTES.DOCTOR,
      asyncHandler(this._DoctorMangmentController.getDoctors)
    );

    this.router.patch(
      HOSPITAL_ADMIN_ROUTES.DOCTOR_TOGGLE_STATUS,
      asyncHandler(this._DoctorMangmentController.BlockOrUnblockDoctor)
    );

    return this.router;
  }
}
