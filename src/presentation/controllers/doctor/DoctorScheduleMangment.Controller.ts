import { Request, Response } from "express";
import { GetSlotsScheduleUseCase } from "../../../applications/usecases/doctor/GetSlots.schedule.UseCase";
import { ApiResponse } from "../../utils/common.response.model";

export class DoctorScheduleMangmentController {
  constructor(private readonly _GetSlotsScheduleUseCase: GetSlotsScheduleUseCase) {}

  getSlots = async (req: Request, res: Response) => {
    const doctorId = req.user?.doctorId;
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10);
    const { date = formattedDate } = req.query;

    if (!doctorId) throw new Error("Invalid request ");

    const slots = await this._GetSlotsScheduleUseCase.execute(doctorId, date as string);
    ApiResponse.success(res, slots);
  };
}
