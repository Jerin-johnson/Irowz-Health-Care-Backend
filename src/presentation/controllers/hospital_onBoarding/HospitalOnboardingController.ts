import { Request, Response } from "express";
import { SubmitHositalVerficationRequest } from "../../../applications/usecases/hosptialOnBorading/SubmitHospitalVerification.usecase";
import { ResubmitHospitalVerificationUseCase } from "../../../applications/usecases/hosptialOnBorading/ReSumbitHospitalVerification.useCase";
export class HospitalOnBoradingController {
  constructor(
    private SubmitHospitalVerificationUseCase: SubmitHositalVerficationRequest,
    private ResubmitHospitalVerificationUseCase: ResubmitHospitalVerificationUseCase
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
    const result = this.ResubmitHospitalVerificationUseCase.execute(
      userId,
      req.body
    );
    return res.json({ success: true, ...result });
  };
}
