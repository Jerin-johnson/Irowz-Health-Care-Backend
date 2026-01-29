import { Response, Request } from "express";
import { GetPatientNotifcationUseCase } from "../../../applications/usecases/patient/notification/PatientNotifcation";
import { ApiResponse } from "../../utils/common.response.model";

export class PatientNotificationController {
  constructor(private readonly _GetPatientNotifcationUseCase: GetPatientNotifcationUseCase) {}

  get = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const result = await this._GetPatientNotifcationUseCase.execute(userId as string);
    return ApiResponse.success(res, result);
  };
}
