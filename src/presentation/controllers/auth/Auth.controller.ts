import { Request, Response } from "express";
import { LoginUseCase } from "../../../applications/usecases/auth/login.useCase";
import { RegisterUserCase } from "../../../applications/usecases/auth/register.useCase";
import { VerfiyOtpUseCase } from "../../../applications/usecases/auth/verfiyOtpUseCase";
import { RefreshTokenUseCase } from "../../../applications/usecases/auth/ReFreshJwtTokenUseCase";
import { ReSendOtpUseCase } from "../../../applications/usecases/auth/ReSendOtpUseCase";

export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private RegisterUseCase: RegisterUserCase,
    private VerfiyOtpUseCase: VerfiyOtpUseCase,
    private RefreshTokenUseCase: RefreshTokenUseCase,
    private ResendOtpUseCase: ReSendOtpUseCase
  ) {}

  login = (allowedRoles: string[]) => async (req: Request, res: Response) => {
    const result = await this.loginUseCase.execute(req.body, allowedRoles);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      accessToken: result.accessToken,
      role: result.role,
      name: result.name,
      email: result.email,
      userId: result.userId,
      hospitalId: result.hospitalId,
      forcePasswordReset: result.forcePasswordReset,
    });
  };

  register = async (req: Request, res: Response) => {
    const result = await this.RegisterUseCase.execute(req.body);
    return res.status(200).json({ success: true, ...result });
  };

  verifyOtp = async (req: Request, res: Response) => {
    const { userId, email, otp } = req.body;

    if (!userId || !email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "fields are missing" });
    }

    const result = await this.VerfiyOtpUseCase.execute(userId, email, otp);
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      accessToken: result.accessToken,
      userRole: result.userRole,
    });
  };

  refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { refreshToken, accessToken, user } =
      await this.RefreshTokenUseCase.execute(token);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    console.log("the access token is invoked", user);
    return res.json({ success: true, accessToken, user });
  };

  resendOtp = async (req: Request, res: Response) => {
    const email = req?.body?.email;
    if (!email) throw new Error("The request is not valid");
    const result = await this.ResendOtpUseCase.execute(email);
    return res.json({ success: true, ...result });
  };

  logout = async (req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    return res
      .status(200)
      .json({ success: true, message: "User logout successfully" });
  };
}
