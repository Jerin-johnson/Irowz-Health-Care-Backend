import { Request, Response } from "express";
import { HosptialRequestVerficationStatus } from "../../../domain/constants/HosptialRequestVerficationStatus";
import { IApproveVerificationRequestUseCase } from "../../../domain/usecase/superAdmin/hospitalVerfication/IApproveVerificationRequestUseCase.usecase";
import { IRejectVerificationRequestUseCase } from "../../../domain/usecase/superAdmin/hospitalVerfication/IRejectVerificationRequestUseCase.usecase";
import { IGetAllVerificationRequestUseCase } from "../../../domain/usecase/superAdmin/hospitalVerfication/IGetAllVerificationRequestUseCase.usecase";
import { IGetHospitalStatsUseCase } from "../../../domain/usecase/superAdmin/hospitalVerfication/IGetHospitalStatsUseCase.usecase";
import { IGetVerificationRequestByIdUseCase } from "../../../domain/usecase/superAdmin/hospitalVerfication/IGetVerificationRequestByIdUseCase.usecase";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";

export class HospitalVerficationController {
  constructor(
    private ApproveVerficationRequest: IApproveVerificationRequestUseCase,
    private RejectVerficationRequest: IRejectVerificationRequestUseCase,
    private GetALLVerficationRequest: IGetAllVerificationRequestUseCase,
    private GetHospitalStatsUseCase: IGetHospitalStatsUseCase,
    private GetVerficationRequestById: IGetVerificationRequestByIdUseCase
  ) {}

  getAllVerficationRequest = async (req: Request, res: Response) => {
    const { page = "1", limit = "10", search, status, city } = req.query;

    const result = await this.GetALLVerficationRequest.execute({
      search: search as string | undefined,
      city: city as string | undefined,
      status: status as HosptialRequestVerficationStatus | undefined,
      page: Number(page),
      limit: Number(limit),
    });

    res.status(HttpStatusCode.OK).json({ ...result, success: true });
  };

  getVerficationRequestById = async (req: Request, res: Response) => {
    const HosptialRequestId = req.params.id;
    const result =
      await this.GetVerficationRequestById.execute(HosptialRequestId);
    return res.status(HttpStatusCode.OK).json({ ...result, success: true });
  };

  getStats = async (_req: Request, res: Response) => {
    const stats = await this.GetHospitalStatsUseCase.execute();
    return res.status(HttpStatusCode.OK).json({ ...stats, success: true });
  };

  approve = async (req: Request, res: Response) => {
    const adminRemarks = req?.body?.adminRemarks;
    const { hospitalId } = req.params;

    const result = await this.ApproveVerficationRequest.execute(
      hospitalId,
      adminRemarks ? adminRemarks : ""
    );

    return res.status(HttpStatusCode.OK).json({ success: true, ...result });
  };

  reject = async (req: Request, res: Response) => {
    const adminRemarks = req?.body?.adminRemarks;
    const { hospitalId } = req.params;

    const result = await this.RejectVerficationRequest.execute(
      hospitalId,
      adminRemarks
    );

    return res.status(HttpStatusCode.OK).json({ success: true, ...result });
  };
}
