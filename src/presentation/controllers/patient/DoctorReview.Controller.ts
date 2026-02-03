import { HttpStatusCode } from "axios";
import { Request, Response } from "express";
import { IPostReviewUseCase } from "../../../domain/usecase/patient/DoctorReview/IPostReviewUseCase";
import { IGetReviewUseCase } from "../../../domain/usecase/patient/DoctorReview/IGetReviewUseCase";
import { CommonMessages } from "../../constants/message/CommonMessages";
import { PatientMessages } from "../../constants/message/Patient.message";

export class DoctorReviewController {
  constructor(
    private readonly _PostReviewUseCase: IPostReviewUseCase,
    private readonly _GetReviewUseCase: IGetReviewUseCase
  ) {}

  postReview = async (req: Request, res: Response) => {
    const { comment, doctorId, rating } = req.body;
    const userId = req.user?.userId;

    if (!comment || !doctorId || !rating) throw new Error(CommonMessages.FIELDS_MISSING);

    await this._PostReviewUseCase.execute({ ...req.body, patientId: userId });

    return res
      .status(HttpStatusCode.Ok)
      .json({ success: true, message: PatientMessages.REVIEW_POSTED });
  };

  getDoctorReview = async (req: Request, res: Response) => {
    const doctorId = req.params.id;

    const data = await this._GetReviewUseCase.execute(doctorId);

    return res.status(HttpStatusCode.Ok).json({ success: true, data: data });
  };
}
