import { Request, Response } from "express";
import { ILoginUseCase } from "../../../domain/usecase/auth/ILogin.useCase";
import { IRegisterUserUseCase } from "../../../domain/usecase/auth/IRegisterUser.useCase";
import { IVerifyOtpUseCase } from "../../../domain/usecase/auth/IVerifyOtpUseCase.usecase";
import { IRefreshTokenUseCase } from "../../../domain/usecase/auth/IRefreshToken.useCase";
import { IReSendOtpUseCase } from "../../../domain/usecase/auth/IResendOtp.useCase";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../DI/tsyringe/tokens";
import { ApiResponse } from "../../utils/common.response.model";
import { IResetPasswordUseCase } from "../../../domain/usecase/auth/IResetPasswordUseCase";
import { IForgetPasswordUseCase } from "../../../domain/usecase/auth/IForgetPasswordUseCase";
import { AuthConstants, AuthMessages } from "../../constants/message/auth/AuthMessages";

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
    private _ResendOtpUseCase: IReSendOtpUseCase,
    @inject(TOKENS.IForgetPasswordUseCase)
    private _ForgetPasswordUseCase: IForgetPasswordUseCase,
    @inject(TOKENS.IResetPasswordUseCase)
    private _ResetPasswordUseCase: IResetPasswordUseCase
  ) {}

  login = (allowedRoles: string[]) => async (req: Request, res: Response) => {
    const result = await this._loginUseCase.execute(
      req.body as { email: string; password: string },
      allowedRoles
    );

    res.cookie(AuthConstants.REFRESH_TOKEN, result.refreshToken, {
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
      patientId: result.patientId,
    });
  };

  register = async (req: Request, res: Response) => {
    const result = await this._RegisterUseCase.execute(req.body);
    res.status(HttpStatusCode.CREATED).json({ success: true, ...result });
    return;
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
        .json({ success: false, message: AuthMessages.FIELDS_MISSING });
    }

    const result = await this._VerfiyOtpUseCase.execute(userId, email, otp);
    res.cookie(AuthConstants.REFRESH_TOKEN, result.refreshToken, {
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
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: AuthMessages.UNAUTHORIZED });
    }

    const { refreshToken, accessToken, user } = await this._RefreshTokenUseCase.execute(token);

    res.cookie(AuthConstants.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({ success: true, accessToken, user });
    return;
  };

  resendOtp = async (req: Request, res: Response) => {
    const { email } = req?.body as { email: string };
    if (!email) throw new Error(AuthMessages.INVALID_REQUEST);

    const result = await this._ResendOtpUseCase.execute(email);
    res.json({ success: true, ...result });
    return;
  };

  logout = async (req: Request, res: Response) => {
    res.clearCookie(AuthConstants.REFRESH_TOKEN);
    res.status(HttpStatusCode.OK).json({ success: true, message: AuthMessages.LOGOUT_SUCCESS });
    return;
  };

  forgetPassword = async (req: Request, res: Response) => {
    const email = req.body?.email;
    if (!email) throw new Error(AuthMessages.INVALID_REQUEST);

    const result = await this._ForgetPasswordUseCase.execute(email);

    ApiResponse.success(res, null, result.message);
    return;
  };

  resetPassword = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) throw new Error(AuthMessages.INVALID_REQUEST);

    const result = await this._ResetPasswordUseCase.execute(token, newPassword);
    ApiResponse.success(res, result.role, result.message);
    return;
  };
}
