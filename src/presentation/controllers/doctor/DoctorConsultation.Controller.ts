import { StartConsultationUseCase } from "../../../applications/usecases/doctor/consultation/StartConsultation.UseCase";
import { Request, Response } from "express";
import { ApiResponse } from "../../utils/common.response.model";

export class DoctorConsultationController {
  constructor(private readonly _StartConsultationUseCase: StartConsultationUseCase) {}

  startConsultation = async (req: Request, res: Response) => {
    const { appointmentId } = req.params;

    const result = await this._StartConsultationUseCase.execute(appointmentId);

    return ApiResponse.success(res, result, "consulation started successfully");
  };
}
