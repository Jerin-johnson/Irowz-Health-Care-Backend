import { Request, Response } from "express";
import { ApiResponse } from "../../utils/common.response.model";
import { GetFullDashboardOverviewUseCase } from "../../../applications/usecases/superAdmin/dashborad/GetDashboardOverviewUseCase";

export class SuperAdminDashboardController {
  constructor(private _overviewUseCase: GetFullDashboardOverviewUseCase) {}

  getOverview = async (req: Request, res: Response) => {
    const data = await this._overviewUseCase.execute();
    return ApiResponse.success(res, data, "super admin dashborad fetched ");
  };
}
