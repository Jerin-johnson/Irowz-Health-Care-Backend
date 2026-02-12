import { Request, Response } from "express";
import { ApiResponse } from "../../utils/common.response.model";
import { IGetFullDashboardOverviewUseCase } from "../../../domain/usecase/superAdmin/dashboard/IGetFullDashboardOverviewUseCase";

export class SuperAdminDashboardController {
  constructor(private _overviewUseCase: IGetFullDashboardOverviewUseCase) {}

  getOverview = async (req: Request, res: Response) => {
    const data = await this._overviewUseCase.execute();
    return ApiResponse.success(res, data, "super admin dashborad fetched ");
  };
}
