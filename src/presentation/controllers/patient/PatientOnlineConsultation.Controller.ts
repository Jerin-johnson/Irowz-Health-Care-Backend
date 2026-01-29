import { Request, Response } from "express";
import { RespondConsultationUseCase } from "../../../applications/usecases/patient/consultation/RespondConsultationUseCase";
import { ApiResponse } from "../../utils/common.response.model";
import { GetConsultationVideoTokenPatientUseCase } from "../../../applications/usecases/patient/consultation/GetConsultationVideoTokenPatient";

export class PatientOnlineConsultationController {
  constructor(
    private readonly _RespondConsultationUseCase: RespondConsultationUseCase,
    private readonly _GetConsultationVideoTokenDoctorUseCase: GetConsultationVideoTokenPatientUseCase
  ) {}

  RespondToCall = async (req: Request, res: Response) => {
    const { consultationId, action } = req.body;
    const userId = req.user?.userId;

    const result = await this._RespondConsultationUseCase.execute(
      consultationId,
      userId as string,
      action
    );

    return ApiResponse.success(res, result);
  };

  videoToken = async (req: Request, res: Response) => {
    const consultationId = req.body?.consultationId;
    const userId = req.user?.userId;

    const result = await this._GetConsultationVideoTokenDoctorUseCase.execute(
      consultationId,
      userId
    );
    return ApiResponse.success(res, result);
  };
}
