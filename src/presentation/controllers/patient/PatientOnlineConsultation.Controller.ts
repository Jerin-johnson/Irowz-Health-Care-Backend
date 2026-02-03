import { Request, Response } from "express";
import { ApiResponse } from "../../utils/common.response.model";
import { IRespondConsultationUseCase } from "../../../domain/usecase/patient/consultation/IRespondConsultationUseCase";
import { IGetConsultationVideoTokenPatientUseCase } from "../../../domain/usecase/patient/consultation/IGetConsultationVideoTokenPatientUseCase";

export class PatientOnlineConsultationController {
  constructor(
    private readonly _RespondConsultationUseCase: IRespondConsultationUseCase,
    private readonly _GetConsultationVideoTokenDoctorUseCase: IGetConsultationVideoTokenPatientUseCase
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
