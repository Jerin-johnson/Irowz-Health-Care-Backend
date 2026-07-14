import { Request, Response } from "express";
import { ISubmitHospitalVerificationRequestUseCase } from "../../../domain/usecase/hospitalOnBoarding/ISubmitHospitalVerificationRequest.usecase";
import { ICheckHospitalVerificationStatusByIdUseCase } from "../../../domain/usecase/hospitalOnBoarding/ICheckHospitalVerificationStatusById.usecase";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";
import { ApiResponse } from "../../utils/common.response.model";
import { CommonMessages } from "../../constants/message/CommonMessages";
import { HospitalOnboardingMessages } from "../../constants/message/HospitalOnboardingMessages";
import { IResubmitHospitalVerificationUseCase } from "../../../domain/usecase/hospitalOnBoarding/IResubmitHospitalVerificationUseCase";

export class HospitalOnBoradingController {
  constructor(
    private SubmitHospitalVerificationUseCase: ISubmitHospitalVerificationRequestUseCase,
    private ResubmitHospitalVerificationUseCase: IResubmitHospitalVerificationUseCase,
    private checkStatusBYId: ICheckHospitalVerificationStatusByIdUseCase
  ) {}

  submitVerficationRequest = async (req: Request, res: Response) => {
    const { body, file } = req;

    if (!file) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: HospitalOnboardingMessages.LICENSE_PDF_REQUIRED });
      return;
    }
    const result = await this.SubmitHospitalVerificationUseCase.execute({
      ...body,
      fileBuffer: file.buffer,
      mimeType: file.mimetype,
    });

    res.json({
      success: true,
      ...result,
      message: HospitalOnboardingMessages.VERIFICATION_SUBMITTED,
    });

    return;
  };

  ressubmitVerficationRequest = async (req: Request, res: Response) => {
    const { body, file } = req;
    const verficationId = req.params.id;

    if (!file) {
      ApiResponse.error(
        res,
        HospitalOnboardingMessages.LICENSE_PDF_REQUIRED,
        HttpStatusCode.BAD_REQUEST
      );
      return;
    }

    const result = this.ResubmitHospitalVerificationUseCase.execute(verficationId, {
      ...body,
      fileBuffer: file.buffer,
      mimeType: file.mimetype,
    });
    res.json({ success: true, ...result });
    return;
  };

  checkStatusById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      ApiResponse.error(res, CommonMessages.INVALID_REQUEST, HttpStatusCode.BAD_REQUEST);
      return;
    }
    const result = await this.checkStatusBYId.execute(id);

    res.status(HttpStatusCode.OK).json({ success: true, ...result });
    return;
  };
}
