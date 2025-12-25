import { success } from "zod";
import { ApproveVerficationRequest } from "../../../applications/usecases/superAdmin/hositpalVerfication/ApproveVerfication.useCase";
import { RejectVerficationRequest } from "../../../applications/usecases/superAdmin/hositpalVerfication/RejectVerfication.useCase";
import { Request, Response } from "express";
import { GetALLVerficationRequest } from "../../../applications/usecases/superAdmin/hositpalVerfication/GetALLVerfication.useCase";
export class HospitalVerficationController {
  constructor(
    private ApproveVerficationRequest: ApproveVerficationRequest,
    private RejectVerficationRequest: RejectVerficationRequest,
    private GetALLVerficationRequest: GetALLVerficationRequest
  ) {}

  getAllVerficationRequest = async (req: Request, res: Response) => {
    const { status, search } = req.query;
    const result = await this.GetALLVerficationRequest.execute();
    return res.status(200).json({ success: true, ...result });
  };

  approve = async (req: Request, res: Response) => {
    const { adminRemarks } = req?.body;
    const { hospitalId } = req.params;

    const result = await this.ApproveVerficationRequest.execute(
      hospitalId,
      adminRemarks ? adminRemarks : ""
    );

    return res.status(200).json({ success: true, ...result });
  };

  reject = async (req: Request, res: Response) => {
    const { adminRemarks } = req.body;
    const { hospitalId } = req.params;

    const result = await this.RejectVerficationRequest.execute(
      hospitalId,
      adminRemarks
    );

    return res.status(200).json({ success: false, ...result });
  };
}
