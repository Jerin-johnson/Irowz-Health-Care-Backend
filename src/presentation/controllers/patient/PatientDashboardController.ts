import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import { IGetPatientDashboardOverviewUseCase } from "../../../domain/usecase/patient/dashboard/IGetPatientDashboardOverviewUseCase";

export class PatientDashboardController {
  constructor(
    private readonly _GetPatientDashboardOverviewUseCase: IGetPatientDashboardOverviewUseCase
  ) {}
  overview = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const patientId = req.user?.patientId;

    const dashboard = await this._GetPatientDashboardOverviewUseCase.execute(patientId!, userId!);

    return res.status(HttpStatusCode.Ok).json({
      success: true,
      data: dashboard,
    });
  };
}
