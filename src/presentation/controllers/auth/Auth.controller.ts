import { Request, Response } from "express";
import { ILoginUseCase } from "../../../domain/usecase/auth/ILogin.useCase";
import { IRegisterUserUseCase } from "../../../domain/usecase/auth/IRegisterUser.useCase";
import { IVerifyOtpUseCase } from "../../../domain/usecase/auth/IVerifyOtpUseCase.usecase";
import { IRefreshTokenUseCase } from "../../../domain/usecase/auth/IRefreshToken.useCase";
import { IReSendOtpUseCase } from "../../../domain/usecase/auth/IResendOtp.useCase";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../DI/tsyringe/tokens";

@injectable()
export class AuthController {
  constructor(
    @inject(TOKENS.ILoginUseCase)
    private _loginUseCase: ILoginUseCase,
    @inject(TOKENS.IRegisterUserUseCase)
    private _RegisterUseCase: IRegisterUserUseCase,
    @inject(TOKENS.IVerifyOtpUseCase)
    private _VerfiyOtpUseCase: IVerifyOtpUseCase,
    @inject(TOKENS.IRefreshTokenUseCase)
    private _RefreshTokenUseCase: IRefreshTokenUseCase,
    @inject(TOKENS.IReSendOtpUseCase)
    private _ResendOtpUseCase: IReSendOtpUseCase
  ) {}

  login = (allowedRoles: string[]) => async (req: Request, res: Response) => {
    const result = await this._loginUseCase.execute(
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
      doctorId: result.doctorId,
      hospitalId: result.hospitalId,
      forcePasswordReset: result.forcePasswordReset,
      profileImage: result.profileImage,
    });
  };

  register = async (req: Request, res: Response) => {
    const result = await this._RegisterUseCase.execute(req.body);
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

    const result = await this._VerfiyOtpUseCase.execute(userId, email, otp);
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(HttpStatusCode.OK).json({
      success: true,
      accessToken: result.accessToken,
      role: result.role,
    });
  };

  refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken as string;

    if (!token) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    const { refreshToken, accessToken, user } = await this._RefreshTokenUseCase.execute(token);

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
    const result = await this._ResendOtpUseCase.execute(email);
    return res.json({ success: true, ...result });
  };

  logout = async (req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: "User logout successfully" });
  };
}
