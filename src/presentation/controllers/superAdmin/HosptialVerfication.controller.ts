import { Request, Response } from "express";
import { HosptialRequestVerficationStatus } from "../../../domain/constants/HosptialRequestVerficationStatus";
import { IApproveVerificationRequestUseCase } from "../../../domain/usecase/superAdmin/hospitalVerfication/IApproveVerificationRequestUseCase.usecase";
import { IRejectVerificationRequestUseCase } from "../../../domain/usecase/superAdmin/hospitalVerfication/IRejectVerificationRequestUseCase.usecase";
import { IGetAllVerificationRequestUseCase } from "../../../domain/usecase/superAdmin/hospitalVerfication/IGetAllVerificationRequestUseCase.usecase";
import { IGetHospitalStatsUseCase } from "../../../domain/usecase/superAdmin/hospitalVerfication/IGetHospitalStatsUseCase.usecase";
import { IGetVerificationRequestByIdUseCase } from "../../../domain/usecase/superAdmin/hospitalVerfication/IGetVerificationRequestByIdUseCase.usecase";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";
import { IViewHospitalLicenseUseCase } from "../../../domain/usecase/superAdmin/hospitalVerfication/IViewHospitalLicenseUseCase";

export class HospitalVerficationController {
  constructor(
    private _ApproveVerficationRequest: IApproveVerificationRequestUseCase,
    private _RejectVerficationRequest: IRejectVerificationRequestUseCase,
    private _GetALLVerficationRequest: IGetAllVerificationRequestUseCase,
    private _GetHospitalStatsUseCase: IGetHospitalStatsUseCase,
    private _GetVerficationRequestById: IGetVerificationRequestByIdUseCase,
    private _viewHospitalLicenseUseCase: IViewHospitalLicenseUseCase
  ) {}

  getAllVerficationRequest = async (req: Request, res: Response) => {
    const { page = "1", limit = "10", search, status, city } = req.query;

    const result = await this._GetALLVerficationRequest.execute({
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
    const result = await this._GetVerficationRequestById.execute(HosptialRequestId);
    return res.status(HttpStatusCode.OK).json({ ...result, success: true });
  };

  getStats = async (_req: Request, res: Response) => {
    const stats = await this._GetHospitalStatsUseCase.execute();
    return res.status(HttpStatusCode.OK).json({ ...stats, success: true });
  };

  approve = async (req: Request, res: Response) => {
    const adminRemarks = req?.body?.adminRemarks;
    const { hospitalId } = req.params;

    const result = await this._ApproveVerficationRequest.execute(
      hospitalId,
      adminRemarks ? adminRemarks : ""
    );

    return res.status(HttpStatusCode.OK).json({ success: true, ...result });
  };

  reject = async (req: Request, res: Response) => {
    const adminRemarks = req?.body?.adminRemarks;
    const { hospitalId } = req.params;

    const result = await this._RejectVerficationRequest.execute(hospitalId, adminRemarks);

    return res.status(HttpStatusCode.OK).json({ success: true, ...result });
  };

  viewLinencsenDocs = async (req: Request, res: Response) => {
    const verificationId = req.params.id;

    const result = await this._viewHospitalLicenseUseCase.execute({
      verificationId,
    });

    return res.status(200).json({ success: true, ...result });
  };
}
