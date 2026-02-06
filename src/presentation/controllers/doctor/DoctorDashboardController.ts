import { Request, Response } from "express";
import { GetDoctorDashboardOverviewUseCase } from "../../../applications/usecases/doctor/dashboard/GetDoctorDashboardOverviewUseCase";

export class DoctorDashboardController {
  constructor(
    private readonly _GetDoctorDashboardOverviewUseCase: GetDoctorDashboardOverviewUseCase
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
