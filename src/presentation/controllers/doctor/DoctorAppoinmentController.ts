import { Request, Response } from "express";
import { ApiResponse } from "../../utils/common.response.model";
import { IGetDoctorAppointmentQueueUseCase } from "../../../domain/usecase/doctor/appoinments/IGetDoctorAppointmentQueueUseCase";
import { IGetAppointmentByIdUseCase } from "../../../domain/usecase/doctor/appoinments/IGetAppointmentByIdUseCase";

export class DoctorAppointmentController {
  constructor(
    private _GetDoctorAppoinmentQueueUsecase: IGetDoctorAppointmentQueueUseCase,
    private _GetAppoinmentBYIdUseCase: IGetAppointmentByIdUseCase
  ) {}

  getLiveQueue = async (req: Request, res: Response) => {
    const doctorId = req.user?.doctorId;
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const formattedDate = tomorrow.toISOString().slice(0, 10);
    const { date = formattedDate } = req.query;

    const result = await this._GetDoctorAppoinmentQueueUsecase.execute(
      doctorId as string,
      date as string
    );
    return ApiResponse.success(res, result);
  };

  getAppointmentById = async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await this._GetAppoinmentBYIdUseCase.execute(id);

    ApiResponse.success(res, result);
  };
}
