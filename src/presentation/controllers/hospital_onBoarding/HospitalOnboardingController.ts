import { Request, Response } from "express";
import { ISubmitHospitalVerificationRequestUseCase } from "../../../domain/usecase/hospitalOnBoarding/ISubmitHospitalVerificationRequest.usecase";
import { ResubmitHospitalVerificationUseCase } from "../../../applications/usecases/hosptialOnBorading/ReSumbitHospitalVerification.useCase";
import { ICheckHospitalVerificationStatusByIdUseCase } from "../../../domain/usecase/hospitalOnBoarding/ICheckHospitalVerificationStatusById.usecase";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";

export class HospitalOnBoradingController {
  constructor(
    private SubmitHospitalVerificationUseCase: ISubmitHospitalVerificationRequestUseCase,
    private ResubmitHospitalVerificationUseCase: ResubmitHospitalVerificationUseCase,
    private checkStatusBYId: ICheckHospitalVerificationStatusByIdUseCase
  ) {}

  submitVerficationRequest = async (req: Request, res: Response) => {
    const { body, file } = req;

    if (!file) {
      return res.status(400).json({ message: "License PDF required" });
    }
    const result = await this.SubmitHospitalVerificationUseCase.execute({
      ...body,
      fileBuffer: file.buffer,
      mimeType: file.mimetype,
    });

    return res.json({
      success: true,
      ...result,
      message: "Hospital registration submitted",
    });
  };

  ressubmitVerficationRequest = async (req: Request, res: Response) => {
    const user = req.user as { userId: string; role: string };
    const userId = user.userId;
    const result = this.ResubmitHospitalVerificationUseCase.execute(userId, req.body);
    return res.json({ success: true, ...result });
  };

  checkStatusById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res.status(HttpStatusCode.BAD_GATEWAY).json("The request is invalid");
    }
    const result = await this.checkStatusBYId.execute(id);

    return res.status(HttpStatusCode.OK).json({ success: true, ...result });
  };
}
