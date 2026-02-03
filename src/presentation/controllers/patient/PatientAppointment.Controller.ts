import { Request, Response } from "express";
import { ApiResponse } from "../../utils/common.response.model";
import { mapAppointmentToResponse } from "../../../applications/dtos/patient/Appointment";
import { IGetPatientQueueStatusUseCase } from "../../../domain/usecase/patient/Appointments/IGetPatientQueueStatusUseCase";
import { IGetPatientAppointmentsUseCase } from "../../../domain/usecase/patient/Appointments/IGetPatientAppointmentsUseCase";
import { ICancelAppointmentUseCase } from "../../../domain/usecase/patient/Appointments/ICancelAppointmentUseCase";
import { ICheckCancelEligibilityUseCase } from "../../../domain/usecase/patient/Appointments/ICheckCancelEligibilityUseCase";
import { ICheckRescheduleEligibilityUseCase } from "../../../domain/usecase/patient/Appointments/ICheckRescheduleEligibilityUseCase";
import { IRescheduleAppointmentUseCase } from "../../../domain/usecase/patient/Appointments/IRescheduleAppointmentUseCase";
import { PatientMessages } from "../../constants/message/Patient.message";

export class PatientAppointmentController {
  constructor(
    private readonly _GetPatientQueueStatusUseCase: IGetPatientQueueStatusUseCase,
    private readonly _GetPatientAppointmentsUseCase: IGetPatientAppointmentsUseCase,
    private readonly _CancelAppointmentUseCase: ICancelAppointmentUseCase,
    private readonly _CheckCancelEligibilityUseCase: ICheckCancelEligibilityUseCase,
    private readonly _CheckRescheduleEligibilityUseCase: ICheckRescheduleEligibilityUseCase,
    private readonly _RescheduleAppointmentUseCase: IRescheduleAppointmentUseCase
  ) {}

  getLiveQueue = async (req: Request, res: Response) => {
    const appointmentId = req.params.id;
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const formattedDate = tomorrow.toISOString().slice(0, 10);

    const result = await this._GetPatientQueueStatusUseCase.execute(appointmentId, formattedDate);

    return ApiResponse.success(res, result, PatientMessages.LIVE_QUEUE_STATUS);
  };

  getAppointments = async (req: Request, res: Response) => {
    const { status = "ALL", date, page = "1", limit = "10" } = req.query;

    const userId = req.user?.userId;

    const result = await this._GetPatientAppointmentsUseCase.execute({
      patientId: userId as string,
      status: status as string,
      date: date as string | undefined,
      page: Number(page),
      limit: Number(limit),
    });

    return ApiResponse.success(
      res,
      { data: result.data.map(mapAppointmentToResponse), total: result.total },
      PatientMessages.APPOINTMENTS_FETCHED
    );
  };

  CancelAppointment = async (req: Request, res: Response) => {
    const result = await this._CancelAppointmentUseCase.execute(req.params.id);
    return ApiResponse.success(res, result);
  };

  checkCancelEligibility = async (req: Request, res: Response) => {
    const result = await this._CheckCancelEligibilityUseCase.execute(req.params.id);
    return ApiResponse.success(res, result);
  };

  checkRescheduleEligibility = async (req: Request, res: Response) => {
    const result = await this._CheckRescheduleEligibilityUseCase.execute(req.params.id);
    return ApiResponse.success(res, result);
  };

  rescheduleAppointment = async (req: Request, res: Response) => {
    const { date: newDate, startTime: newStartTime, newEndTime } = req.body;

    console.log(req.body);

    const result = await this._RescheduleAppointmentUseCase.execute(
      req.params.id,
      newDate,
      newStartTime,
      newEndTime
    );

    return ApiResponse.success(res, result);
  };
}
