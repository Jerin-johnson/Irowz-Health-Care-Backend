import { Request, Response } from "express";
import { ILoginUseCase } from "../../../domain/usecase/auth/ILogin.useCase";
import { IRegisterUserUseCase } from "../../../domain/usecase/auth/IRegisterUser.useCase";
import { IVerifyOtpUseCase } from "../../../domain/usecase/auth/IVerifyOtpUseCase.usecase";
import { IRefreshTokenUseCase } from "../../../domain/usecase/auth/IRefreshToken.useCase";
import { IReSendOtpUseCase } from "../../../domain/usecase/auth/IResendOtp.useCase";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";

export class AuthController {
  constructor(
    private loginUseCase: ILoginUseCase,
    private RegisterUseCase: IRegisterUserUseCase,
    private VerfiyOtpUseCase: IVerifyOtpUseCase,
    private RefreshTokenUseCase: IRefreshTokenUseCase,
    private ResendOtpUseCase: IReSendOtpUseCase
  ) {}

  login = (allowedRoles: string[]) => async (req: Request, res: Response) => {
    const result = await this.loginUseCase.execute(
      req.body as { email: string; password: string },
      allowedRoles
    );

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(HttpStatusCode.OK).json({
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
    const { userId, email, otp } = req.body as {
      email: string;
      userId: string;
      otp: string;
    };

    if (!userId || !email || !otp) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ success: false, message: "fields are missing" });
    }

    const result = await this.VerfiyOtpUseCase.execute(userId, email, otp);
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(HttpStatusCode.OK).json({
      success: true,
      accessToken: result.accessToken,
      userRole: result.userRole,
    });
  };

  refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken as string;

    if (!token) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    const { refreshToken, accessToken, user } = await this.RefreshTokenUseCase.execute(token);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    console.log("the access token is invoked", user);
    return res.json({ success: true, accessToken, user });
  };

  resendOtp = async (req: Request, res: Response) => {
    const { email } = req?.body as { email: string };
    if (!email) throw new Error("The request is not valid");
    const result = await this.ResendOtpUseCase.execute(email);
    return res.json({ success: true, ...result });
  };

  logout = async (req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: "User logout successfully" });
  };
}
