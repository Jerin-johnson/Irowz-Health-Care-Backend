import { Request, Response } from "express";
import { ListHospitalLabOrdersUseCase } from "../../../applications/usecases/hospitalAdmin/LabOrder/ListHospitalLabOrdersUseCase";
import { UploadHospitalLabTestUseCase } from "../../../applications/usecases/hospitalAdmin/LabOrder/UploadHospitalLabTestUseCase";
import { ApiResponse } from "../../utils/common.response.model";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";

export class HospitalLabAdminController {
  constructor(
    private readonly _ListHospitalLabOrdersUseCase: ListHospitalLabOrdersUseCase,
    private readonly _UploadHospitalLabTestUseCase: UploadHospitalLabTestUseCase
  ) {}

  listLabOrders = async (req: Request, res: Response) => {
    const { page = 1, limit = 10, status = undefined } = req.query;
    const hospitalId = req.user?.hospitalId;
    const result = await this._ListHospitalLabOrdersUseCase.execute({
      hospitalId: hospitalId!,
      page: Number(page),
      limit: Number(limit),
      status: status as "PENDING" | "RESULT_UPLOADED",
    });

    console.log("the result", result);

    return ApiResponse.success(res, result);
  };

  uploadLabReport = async (req: Request, res: Response) => {
    if (!req.file) {
      throw new Error("file is required actually");
    }

    const result = await this._UploadHospitalLabTestUseCase.execute({
      orderId: req.body.orderId,
      appointmentId: req.body.appointmentId,
      testName: req.body.testName,
      fileBuffer: req.file.buffer,
      mimeType: req.file.mimetype,
    });

    return ApiResponse.success(res, null, result.message, HttpStatusCode.CREATED);
  };
}
