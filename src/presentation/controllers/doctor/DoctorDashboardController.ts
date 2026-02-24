import { Request, Response } from "express";
import { IGetDoctorDashboardOverviewUseCase } from "../../../domain/usecase/doctor/dashborad/IGetDoctorDashboardOverviewUseCase";

export class DoctorDashboardController {
  constructor(
    private readonly _GetDoctorDashboardOverviewUseCase: IGetDoctorDashboardOverviewUseCase
  ) {}
  overview = async (req: Request, res: Response) => {
    const doctorId = req.user?.doctorId;

    const dashboard = await this._GetDoctorDashboardOverviewUseCase.execute(doctorId!);

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  };
}
