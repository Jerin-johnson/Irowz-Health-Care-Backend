import { Router } from "express";
import { HospitalOnBoradingController } from "../controllers/hospital_onBoarding/HospitalOnboardingController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { Upload } from "../middlewares/UploadPdfLiensches";
import { hospitalVerificationBodySchema } from "../validators/hosptial/HosptialVerfication";
import { validate } from "../middlewares/validate.middleware";
import { SpecialtyMangmentController } from "../controllers/hospitalAdmin/SpecialityMangment.Controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import UserRoles from "../../domain/constants/UserRole";
import { authorizeRoles } from "../middlewares/role.middleware";
import { DoctorMangmentController } from "../controllers/hospitalAdmin/DoctorMangment.Controller";
import { AdminCreateDoctorSchema } from "../validators/hosptial/AdminCreateDoctor";
import { HOSPITAL_ADMIN_ROUTES } from "../constants/routes/hospital-admin.constants.routes";
import { subscriptionPlanChecker } from "../middlewares/subscription/subsciptionPlanChecker";
import { HospitalADminSubscriptionController } from "../controllers/hospitalAdmin/SubscriptionController";
import { HospitalDashboardController } from "../controllers/hospitalAdmin/HospitalDashboardController";
import { HospitalLabAdminController } from "../controllers/hospitalAdmin/LabOrderMangment.Controller";

export class HospitalAdminRoutes {
  private router: Router;

  constructor(
    private readonly _HospitalOnBoradingController: HospitalOnBoradingController,
    private readonly _SpecialtyMangmentController: SpecialtyMangmentController,
    private readonly _DoctorMangmentController: DoctorMangmentController,
    private readonly _HospitalADminSubscriptionController: HospitalADminSubscriptionController,
    private readonly _HospitalDashboardController: HospitalDashboardController,
    private readonly _HospitalLabAdminController: HospitalLabAdminController
  ) {
    this.router = Router();
  }

  register(): Router {
    this.router.post(
      HOSPITAL_ADMIN_ROUTES.VERIFICATION,
      Upload.single("licenseDocument"),
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
      Upload.single("licenseDocument"),
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
      subscriptionPlanChecker,
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

    this.router.get(
      "/subscription/plans",
      asyncHandler(this._HospitalADminSubscriptionController.GetSubcriptionPlans)
    );

    this.router.post(
      "/subscription/order",
      asyncHandler(this._HospitalADminSubscriptionController.createOrder)
    );

    this.router.post(
      "/subscription/confirm",
      asyncHandler(this._HospitalADminSubscriptionController.confirmPayment)
    );

    //dashboard

    this.router.get(
      "/dashboard/overview",
      asyncHandler(this._HospitalDashboardController.overview)
    );

    //lab Orders

    this.router.get("/lab-orders", asyncHandler(this._HospitalLabAdminController.listLabOrders));
    this.router.post(
      "/lab-orders",
      Upload.single("file"),
      asyncHandler(this._HospitalLabAdminController.uploadLabReport)
    );

    return this.router;
  }
}
