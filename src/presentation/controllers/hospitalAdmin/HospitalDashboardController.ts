import { Request, Response } from "express";
import { ApiResponse } from "../../utils/common.response.model";
import { IGetHospitalDashboardOverviewUseCase } from "../../../domain/usecase/hosptialAdmin/dashboard/IGetHospitalDashboardOverviewUseCase";

export class HospitalDashboardController {
  constructor(
    private readonly _GetHospitalDashboardOverviewUseCase: IGetHospitalDashboardOverviewUseCase
  ) {}

  overview = async (req: Request, res: Response) => {
    const hospitalId = req.user?.hospitalId;
    const userId = req.user?.userId;

    const dashboard = await this._GetHospitalDashboardOverviewUseCase.execute(hospitalId!, userId!);

    return ApiResponse.success(res, dashboard);
  };
}
