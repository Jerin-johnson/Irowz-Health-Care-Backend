import { Request, Response } from "express";
import { GetPatientDashboardOverviewUseCase } from "../../../applications/usecases/patient/dashboard/GetPatientDashboardOverviewUseCase";
import { HttpStatusCode } from "axios";

export class PatientDashboardController {
  constructor(
    private readonly _GetPatientDashboardOverviewUseCase: GetPatientDashboardOverviewUseCase
  ) {}
  overview = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const patientId = req.user?.patientId;

    const dashboard = await this._GetPatientDashboardOverviewUseCase.execute(patientId!, userId!);

    res.status(HttpStatusCode.Ok).json({
      success: true,
      data: dashboard,
    });
  };
}
