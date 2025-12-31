import { success } from "zod";
import { GetDoctorProfileUseCase } from "../../../applications/usecases/doctor/GetDoctorProfile.UseCase";
import { Request, Response } from "express";
import { DoctorProfileMapper } from "../../dtos/doctorProfile.mapper";

export class DoctorProfileMangementController {
  constructor(
    private readonly _GetDoctorProfileUseCase: GetDoctorProfileUseCase
  ) {}

  getDoctorProfile = async (req: Request, res: Response) => {
    const doctorId = req.user?.doctorId;

    const doctor = await this._GetDoctorProfileUseCase.execute(
      doctorId as string
    );

    const responseDto = DoctorProfileMapper.toView(doctor);

    return res.status(200).json({ success: true, data: responseDto });
  };
}
