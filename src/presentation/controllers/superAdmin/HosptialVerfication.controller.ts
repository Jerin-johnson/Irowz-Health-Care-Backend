import { json, success } from "zod";
import { ApproveVerficationRequest } from "../../../applications/usecases/superAdmin/hositpalVerfication/ApproveVerfication.useCase";
import { RejectVerficationRequest } from "../../../applications/usecases/superAdmin/hositpalVerfication/RejectVerfication.useCase";
import { Request, Response } from "express";
import { GetALLVerficationRequest } from "../../../applications/usecases/superAdmin/hositpalVerfication/GetALLVerfication.useCase";
import { GetHospitalStatsUseCase } from "../../../applications/usecases/superAdmin/hositpalVerfication/GetHospitalStats.usecase";
import { HosptialRequestVerficationStatus } from "../../../domain/constants/HosptialRequestVerficationStatus";
import { GetVerficationRequestById } from "../../../applications/usecases/superAdmin/hositpalVerfication/GetVerficationRequestById";
export class HospitalVerficationController {
  constructor(
    private ApproveVerficationRequest: ApproveVerficationRequest,
    private RejectVerficationRequest: RejectVerficationRequest,
    private GetALLVerficationRequest: GetALLVerficationRequest,
    private GetHospitalStatsUseCase: GetHospitalStatsUseCase,
    private GetVerficationRequestById: GetVerficationRequestById
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

    res.status(200).json({ ...result, success: true });
  };

  getVerficationRequestById = async (req: Request, res: Response) => {
    const HosptialRequestId = req.params.id;
    const result =
      await this.GetVerficationRequestById.execute(HosptialRequestId);
    return res.status(200).json({ ...result, success: true });
  };

  getStats = async (_req: Request, res: Response) => {
    const stats = await this.GetHospitalStatsUseCase.execute();
    return res.status(200).json({ ...stats, success: true });
  };

  approve = async (req: Request, res: Response) => {
    const adminRemarks = req?.body?.adminRemarks;
    const { hospitalId } = req.params;

    const result = await this.ApproveVerficationRequest.execute(
      hospitalId,
      adminRemarks ? adminRemarks : ""
    );

    return res.status(200).json({ success: true, ...result });
  };

  reject = async (req: Request, res: Response) => {
    const adminRemarks = req?.body?.adminRemarks;
    const { hospitalId } = req.params;

    const result = await this.RejectVerficationRequest.execute(
      hospitalId,
      adminRemarks
    );

    return res.status(200).json({ success: true, ...result });
  };
}
