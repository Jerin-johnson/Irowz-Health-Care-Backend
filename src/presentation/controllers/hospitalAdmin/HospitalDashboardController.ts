import { Request, Response } from "express";
import { GetHospitalDashboardOverviewUseCase } from "../../../applications/usecases/hospitalAdmin/dashboard/HosptialAdminDashboardUseCase";
import { ApiResponse } from "../../utils/common.response.model";

export class HospitalDashboardController {
  constructor(
    private readonly _GetHospitalDashboardOverviewUseCase: GetHospitalDashboardOverviewUseCase
  ) {}

  overview = async (req: Request, res: Response) => {
    const hospitalId = req.user?.hospitalId;
    const userId = req.user?.userId;

    const dashboard = await this._GetHospitalDashboardOverviewUseCase.execute(hospitalId!, userId!);

    return ApiResponse.success(res, dashboard);
  };
}
