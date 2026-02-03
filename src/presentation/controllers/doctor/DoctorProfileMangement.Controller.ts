import { Request, Response } from "express";
import { DoctorProfileMapper } from "../../../applications/dtos/doctor/doctorProfile.mapper";
import { IGetDoctorProfileUseCase } from "../../../domain/usecase/doctor/doctorProfile/IGetDoctorProfileUseCase.usecase";
import { IResetDoctorPasswordUseCase } from "../../../domain/usecase/doctor/doctorProfile/IResetDoctorPasswordUseCase.usecase";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";
import { EditDoctorProfileUseCase } from "../../../applications/usecases/doctor/doctorProfile/EditDoctorProfile.UseCase";
import { CommonMessages } from "../../constants/message/CommonMessages";

export class DoctorProfileMangementController {
  constructor(
    private readonly _GetDoctorProfileUseCase: IGetDoctorProfileUseCase,
    private readonly _ResetDoctorPassword: IResetDoctorPasswordUseCase,
    private readonly _EditDoctorProfileUseCase: EditDoctorProfileUseCase
  ) {}

  getDoctorProfile = async (req: Request, res: Response) => {
    const doctorId = req.user?.doctorId;

    const doctor = await this._GetDoctorProfileUseCase.execute(doctorId as string);

    const responseDto = DoctorProfileMapper.toView(doctor);

    return res.status(HttpStatusCode.OK).json({ success: true, data: responseDto });
  };

  resetDoctorPassword = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const newPassword = req.body?.newPassword;
    const currentPassword = req.body?.currentPassword;

    if (!newPassword || !currentPassword) throw new Error(CommonMessages.FIELDS_MISSING);

    const result = await this._ResetDoctorPassword.execute(
      userId as string,
      currentPassword,
      newPassword
    );

    return res.status(HttpStatusCode.OK).json({ success: true, ...result });
  };

  editDoctorProfile = async (req: Request, res: Response) => {
    const doctorId = req.user?.doctorId as string;
    const userId = req.user?.userId as string;

    const result = await this._EditDoctorProfileUseCase.execute(
      doctorId,
      userId,
      req.body,
      req.file
    );
    return res.status(HttpStatusCode.OK).json({ success: true, ...result });
  };
}
