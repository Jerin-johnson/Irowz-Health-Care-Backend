import { Request, Response } from "express";
import { GetActivePlansForListingHospitalAdminUseCase } from "../../../applications/usecases/hospitalAdmin/subscription/GetSubscriptionPlans";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";
import { ApiResponse } from "../../utils/common.response.model";

export class HospitalADminSubscriptionController {
  constructor(
    private readonly _GetActivePlansForListingHospitalAdminUseCase: GetActivePlansForListingHospitalAdminUseCase
  ) {}

  GetSubcriptionPlans = async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const data = await this._GetActivePlansForListingHospitalAdminUseCase.execute(userId as string);

    return ApiResponse.success(res, data, "fetched successfully", HttpStatusCode.OK);
  };
}
