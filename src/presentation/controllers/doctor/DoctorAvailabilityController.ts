import { Request, Response } from "express";
import { UpsertDoctorAvailabilityUseCase } from "../../../applications/usecases/doctor/doctorAvailability/DoctorAvailabilityController";
import { ApiResponse } from "../../utils/common.response.model";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";
import { IConfirmDoctorAvailabilityChangeUseCase } from "../../../domain/usecase/doctor/doctorAvailbility/IConfirmDoctorAvailabilityChangeUseCase";
import { ICheckDoctorAvailabilityUseCase } from "../../../domain/usecase/doctor/doctorAvailbility/ICheckDoctorAvailabilityUseCase";
import { DoctorMessages } from "../../constants/message/doctor.message";

export class DoctorAvailabilityController {
  constructor(
    private readonly _upsertAvailability: UpsertDoctorAvailabilityUseCase,
    private readonly _ConfirmDoctorAvailabilityChangeUseCase: IConfirmDoctorAvailabilityChangeUseCase,
    private readonly _CheckDoctorAvailabilityUseCase: ICheckDoctorAvailabilityUseCase
  ) {}

  upsert = async (req: Request, res: Response) => {
    const doctorId = req.user?.doctorId as string;

    const availability = await this._upsertAvailability.execute(doctorId, req.body);

    res.status(HttpStatusCode.ACCEPTED).json({
      success: true,
      data: availability,
    });
  };

  get = async (req: Request, res: Response) => {
    const doctorId = req.user?.doctorId;

    const availability = await this._upsertAvailability["_availabilityRepo"].findByDoctorId(
      doctorId as string
    );

    ApiResponse.success(res, availability);
    return;
  };

  checkEditConfilt = async (req: Request, res: Response) => {
    const doctorId = req.user?.doctorId as string;

    console.log(req.body);

    const availability = await this._CheckDoctorAvailabilityUseCase.execute(
      doctorId,
      req.body.weeklySchedule
    );

    ApiResponse.success(res, availability);
    return;
  };

  confirmAvailabilityChange = async (req: Request, res: Response) => {
    const doctorId = req.user!.doctorId as string;

    const {
      weeklySchedule,
      slotDurationMinutes,
      maxPatientsPerDay,
      teleConsultationEnabled,
      timezone,
    } = req.body;

    if (!weeklySchedule) {
      return ApiResponse.error(
        res,
        DoctorMessages.WEEKLY_SCHEDULE_REQUIRED,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const result = await this._ConfirmDoctorAvailabilityChangeUseCase.execute(doctorId, {
      weeklySchedule,
      slotDurationMinutes,
      maxPatientsPerDay,
      teleConsultationEnabled,
      timezone,
    });

    ApiResponse.success(res, result, DoctorMessages.AVAILABILITY_UPDATED);
    return;
  };
}
