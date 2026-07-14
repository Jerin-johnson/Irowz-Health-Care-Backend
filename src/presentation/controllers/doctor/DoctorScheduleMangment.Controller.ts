import { Request, Response } from "express";
import { ApiResponse } from "../../utils/common.response.model";
import { IGetSlotsScheduleUseCase } from "../../../domain/usecase/doctor/schudele/IGetSlotsScheduleUseCase";
import { IBlockDoctorSlotUseCase } from "../../../domain/usecase/doctor/schudele/IBlockDoctorSlotUseCase";
import { CommonMessages } from "../../constants/message/CommonMessages";

export class DoctorScheduleMangmentController {
  constructor(
    private readonly _GetSlotsScheduleUseCase: IGetSlotsScheduleUseCase,
    private readonly _BlockDoctorSlotUseCase: IBlockDoctorSlotUseCase
  ) {}

  getSlots = async (req: Request, res: Response) => {
    const doctorId = req.user?.doctorId;
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10);
    const { date = formattedDate } = req.query;

    if (!doctorId) throw new Error(CommonMessages.INVALID_REQUEST);

    const slots = await this._GetSlotsScheduleUseCase.execute(doctorId, date as string);
    ApiResponse.success(res, slots);
    return;
  };

  blockSlots = async (req: Request, res: Response) => {
    const doctorId = req.user?.doctorId;
    const { date, startTime } = req.body;
    if (!startTime || !date) throw new Error(CommonMessages.INVALID_REQUEST);

    await this._BlockDoctorSlotUseCase.execute(doctorId as string, date, startTime);
    ApiResponse.success(res);
    return;
  };
}
