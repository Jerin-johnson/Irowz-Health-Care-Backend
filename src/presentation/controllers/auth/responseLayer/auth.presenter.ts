import { Response } from "express";
import { HttpStatusCode } from "../../../../domain/constants/HttpStatusCode";

export class AuthPresenter {
  static login(res: Response, data: any) {
    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(HttpStatusCode.OK).json({
      success: true,
      accessToken: data.accessToken,
      user: {
        id: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
        doctorId: data.doctorId,
        hospitalId: data.hospitalId,
        profileImage: data.profileImage,
        forcePasswordReset: data.forcePasswordReset,
      },
    });
  }

  static refresh(res: Response, data: any) {
    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(HttpStatusCode.OK).json({
      success: true,
      accessToken: data.accessToken,
      user: data.user,
    });
  }

  static success(res: Response, payload: any = {}) {
    return res.status(HttpStatusCode.OK).json({
      success: true,
      ...payload,
    });
  }

  static logout(res: Response) {
    res.clearCookie("refreshToken");
    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: "User logout successfully" });
  }
}
