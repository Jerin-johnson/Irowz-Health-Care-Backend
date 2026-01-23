import { Request, Response } from "express";
import { GetDoctorAppoinmentQueueUsecase } from "../../../applications/usecases/doctor/appoinment/GetDoctorAppoinmentQueue.usecase";
import { ApiResponse } from "../../utils/common.response.model";
import { GetAppoinmentBYIdUseCase } from "../../../applications/usecases/doctor/appoinment/GetAppoinmentBYIdUseCase";

export class DoctorAppointmentController {
  constructor(
    private _GetDoctorAppoinmentQueueUsecase: GetDoctorAppoinmentQueueUsecase,
    private _GetAppoinmentBYIdUseCase: GetAppoinmentBYIdUseCase
  ) {}

  getLiveQueue = async (req: Request, res: Response) => {
    const doctorId = req.user?.doctorId;
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const formattedDate = tomorrow.toISOString().slice(0, 10);
    const { date = formattedDate } = req.query;

    console.log("THe date object is", date);
    const result = await this._GetDoctorAppoinmentQueueUsecase.execute(
      doctorId as string,
      date as string
    );
    ApiResponse.success(res, result, "THis is the doctor live queque");
  };

  getAppointmentById = async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await this._GetAppoinmentBYIdUseCase.execute(id);

    ApiResponse.success(res, result, "Appoinment feched succesfull");
  };
}
