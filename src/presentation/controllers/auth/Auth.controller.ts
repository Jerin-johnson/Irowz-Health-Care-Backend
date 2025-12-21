import { Request, Response } from "express";
import { LoginUseCase } from "../../../applications/usecases/auth/login.useCase";
import { RegisterUserCase } from "../../../applications/usecases/auth/register.useCase";
import { VerfiyOtpUseCase } from "../../../applications/usecases/auth/verfiyOtpUseCase";

export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private RegisterUseCase: RegisterUserCase,
    private VerfiyOtpUseCase: VerfiyOtpUseCase
  ) {}

  login = async (req: Request, res: Response) => {
    const result = await this.loginUseCase.execute(req.body);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      accessToken: result.accessToken,
    });
  };

  register = async (req: Request, res: Response) => {
    const result = await this.RegisterUseCase.execute(req.body);
    return res.status(200).json({ success: true, ...result });
  };

  verifyOtp = async (req: Request, res: Response) => {
    const { userId, otp } = req.body;
    const result = await this.VerfiyOtpUseCase.execute(userId, otp);
    return res.status(200).json({ success: true, ...result });
  };
}
