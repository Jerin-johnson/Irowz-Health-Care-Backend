import { success } from "zod";

import { Request, Response } from "express";
import { DoctorProfileMapper } from "../../dtos/doctorProfile.mapper";
import { GetDoctorProfileUseCase } from "../../../applications/usecases/doctor/doctorProfile/GetDoctorProfile.UseCase";
import { ResetDoctorPasswordUseCase } from "../../../applications/usecases/doctor/doctorProfile/ResetPassword.UseCase";

export class DoctorProfileMangementController {
  constructor(
    private readonly _GetDoctorProfileUseCase: GetDoctorProfileUseCase,
    private readonly _ResetDoctorPassword: ResetDoctorPasswordUseCase
  ) {}

  getDoctorProfile = async (req: Request, res: Response) => {
    const doctorId = req.user?.doctorId;

    const doctor = await this._GetDoctorProfileUseCase.execute(
      doctorId as string
    );

    const responseDto = DoctorProfileMapper.toView(doctor);

    return res.status(200).json({ success: true, data: responseDto });
  };

  resetDoctorPassword = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const newPassword = req.body?.newPassword;
    const currentPassword = req.body?.currentPassword;

    if (!newPassword || !currentPassword)
      throw new Error("Fields are missing invalid request");

    const result = await this._ResetDoctorPassword.execute(
      userId as string,
      currentPassword,
      newPassword
    );

    return res.status(200).json({ success: true, ...result });
  };
}
