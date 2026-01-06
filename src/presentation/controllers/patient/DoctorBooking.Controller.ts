import { GetDoctorAvailabileSlotUseCase } from "../../../applications/usecases/patient/AvailableSlot/GetDoctorAvailableSlot.UseCase";
import { Request, Response } from "express";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";
import { LockDoctorSlotUseCase } from "../../../applications/usecases/patient/BookingSlot/LockDoctorSlotUseCase";

export class DoctorBookingController {
  constructor(
    private readonly _GetDoctorAvailabileSlotUseCase: GetDoctorAvailabileSlotUseCase,
    private readonly _lockDoctorSlotUseCase: LockDoctorSlotUseCase
  ) {}

  GetAvailableSlots = async (req: Request, res: Response) => {
    const doctorId = req.query.id;
    const date = req.query.date;

    console.log(doctorId, date);

    if (!doctorId || !date) throw new Error("Invalid Request");

    const slots = await this._GetDoctorAvailabileSlotUseCase.execute(
      doctorId as string,
      date as string
    );
    res.status(HttpStatusCode.OK).json({
      success: true,
      data: slots,
    });
  };

  lockDoctorSlot = async (req: Request, res: Response) => {
    const { doctorId, date, startTime } = req.body;
    const userId = req.user?.userId as string;

    const result = await this._lockDoctorSlotUseCase.execute({
      doctorId,
      date,
      startTime,
      userId,
    });

    if (!result.locked) {
      return res.status(409).json({
        success: false,
        message: "This slot was just taken by another patient",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Slot locked successfully",
      expiresIn: 500,
    });
  };
}
