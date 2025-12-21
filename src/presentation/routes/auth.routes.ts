import { Router } from "express";
import { AuthController } from "../controllers/auth/Auth.controller";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema } from "../validators/auth/login.schema";
import { registerSchema } from "../validators/auth/register.schema";

export class AuthRoute {
  private router: Router;

  constructor(private readonly authController: AuthController) {
    this.router = Router();
  }

  register(): Router {
    this.router.post(
      "/login",
      validate(loginSchema),
      asyncHandler(this.authController.login)
    );

    this.router.post(
      "/register",
      validate(registerSchema),
      asyncHandler(this.authController.register)
    );

    this.router.post("/verify-otp", this.authController.verifyOtp);
    // this.router.post("/refresh-token", ...)

    return this.router;
  }
}
