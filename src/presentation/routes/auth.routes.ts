import { Router } from "express";
import { AuthController } from "../controllers/auth/Auth.controller";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema } from "../validators/auth/login.schema";
import { registerSchema } from "../validators/auth/register.schema";
import UserRoles from "../../domain/constants/UserRole";
import { AUTH_ROUTES } from "../constants/routes/auth.contants.routes";

export class AuthRoute {
  private router: Router;

  constructor(private readonly authController: AuthController) {
    this.router = Router();
  }

  register(): Router {
    // Patient
    this.router.post(
      AUTH_ROUTES.LOGIN,
      validate(loginSchema),
      asyncHandler(this.authController.login([UserRoles.PATIENT]))
    );

    this.router.post(
      AUTH_ROUTES.REGISTER,
      validate(registerSchema),
      asyncHandler(this.authController.register)
    );

    this.router.post(AUTH_ROUTES.VERIFY_OTP, asyncHandler(this.authController.verifyOtp));

    this.router.post(AUTH_ROUTES.RESEND_OTP, asyncHandler(this.authController.resendOtp));

    // Doctor
    this.router.post(
      AUTH_ROUTES.DOCTOR_LOGIN,
      validate(loginSchema),
      asyncHandler(this.authController.login([UserRoles.DOCTOR]))
    );

    // Hospital Admin
    this.router.post(
      AUTH_ROUTES.HOSPITAL_ADMIN_LOGIN,
      validate(loginSchema),
      asyncHandler(this.authController.login([UserRoles.HOSPITAL_ADMIN]))
    );

    // Super Admin
    this.router.post(
      AUTH_ROUTES.SUPER_ADMIN_LOGIN,
      validate(loginSchema),
      asyncHandler(this.authController.login([UserRoles.SUPER_ADMIN]))
    );

    this.router.get(AUTH_ROUTES.REFRESH_TOKEN, asyncHandler(this.authController.refreshToken));

    this.router.get(AUTH_ROUTES.LOGOUT, asyncHandler(this.authController.logout));

    return this.router;
  }
}
