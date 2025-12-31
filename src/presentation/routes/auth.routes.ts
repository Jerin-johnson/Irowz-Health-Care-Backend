import { Router } from "express";
import { AuthController } from "../controllers/auth/Auth.controller";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema } from "../validators/auth/login.schema";
import { registerSchema } from "../validators/auth/register.schema";
import UserRoles from "../../domain/constants/UserRole";

export class AuthRoute {
  private router: Router;

  constructor(private readonly authController: AuthController) {
    this.router = Router();
  }

  register(): Router {
    //Patient login
    this.router.post(
      "/login",
      validate(loginSchema),
      asyncHandler(this.authController.login([UserRoles.PATIENT]))
    );

    this.router.post(
      "/register",
      validate(registerSchema),
      asyncHandler(this.authController.register)
    );

    this.router.post("/verify-otp", this.authController.verifyOtp);

    //doctor login
    this.router.post(
      "/doctor/login",
      validate(loginSchema),
      asyncHandler(this.authController.login([UserRoles.DOCTOR]))
    );

    //hostpal_admin

    this.router.post(
      "/hospital-admin/login",
      validate(loginSchema),
      asyncHandler(this.authController.login([UserRoles.HOSPITAL_ADMIN]))
    );

    //login super admin

    this.router.post(
      "/super-admin/login",
      validate(loginSchema),
      asyncHandler(this.authController.login([UserRoles.SUPER_ADMIN]))
    );

    this.router.get(
      "/refresh-token",
      asyncHandler(this.authController.refreshToken)
    );

    this.router.post(
      "/resend-otp",
      asyncHandler(this.authController.resendOtp)
    );

    this.router.get("/logout", asyncHandler(this.authController.logout));

    return this.router;
  }
}
