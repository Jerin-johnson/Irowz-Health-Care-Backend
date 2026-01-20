import { Request, Response } from "express";
import { GetDoctorAppoinmentQueueUsecase } from "../../../applications/usecases/doctor/appoinment/GetDoctorAppoinmentQueue.usecase";
import { ApiResponse } from "../../utils/common.response.model";

export class DoctorAppointmentController {
  constructor(private _GetDoctorAppoinmentQueueUsecase: GetDoctorAppoinmentQueueUsecase) {}

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
}
