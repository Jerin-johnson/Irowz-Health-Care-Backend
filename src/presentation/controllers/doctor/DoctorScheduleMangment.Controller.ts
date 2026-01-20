import { Request, Response } from "express";

import { ApiResponse } from "../../utils/common.response.model";
import { GetSlotsScheduleUseCase } from "../../../applications/usecases/doctor/schedule/GetSlots.schedule.UseCase";
import { BlockDoctorSlotUseCase } from "../../../applications/usecases/doctor/schedule/BlockSlots.Schedule.useCase";

export class DoctorScheduleMangmentController {
  constructor(
    private readonly _GetSlotsScheduleUseCase: GetSlotsScheduleUseCase,
    private readonly _BlockDoctorSlotUseCase: BlockDoctorSlotUseCase
  ) {}

  getSlots = async (req: Request, res: Response) => {
    const doctorId = req.user?.doctorId;
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10);
    const { date = formattedDate } = req.query;

    if (!doctorId) throw new Error("Invalid request ");

    const slots = await this._GetSlotsScheduleUseCase.execute(doctorId, date as string);
    ApiResponse.success(res, slots);
  };

  blockSlots = async (req: Request, res: Response) => {
    const doctorId = req.user?.doctorId;
    const { date, startTime } = req.body;
    if (!startTime || !date) throw new Error("invalid request");

    await this._BlockDoctorSlotUseCase.execute(doctorId as string, date, startTime);
    ApiResponse.success(res);
  };
}
