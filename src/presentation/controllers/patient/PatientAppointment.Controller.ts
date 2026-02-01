import { GetPatientQueueStatusUseCase } from "../../../applications/usecases/patient/Appointments/GetPatientQueueStatusUseCase";
import { Request, Response } from "express";
import { ApiResponse } from "../../utils/common.response.model";
import { GetPatientAppointmentsUseCase } from "../../../applications/usecases/patient/Appointments/GetAppointment.UseCase";
import { mapAppointmentToResponse } from "../../../applications/dtos/patient/Appointment";
import { CancelAppointmentUseCase } from "../../../applications/usecases/patient/Appointments/CancelAppointment.useCase";
import { CheckCancelEligibilityUseCase } from "../../../applications/usecases/patient/Appointments/CheckCancelEligibilityUsecase";
import { CheckRescheduleEligibilityUseCase } from "../../../applications/usecases/patient/Appointments/CheckReschduleEligiblity.useCase";
import { RescheduleAppointmentUseCase } from "../../../applications/usecases/patient/Appointments/RescheduleAppointment.useCase";

export class PatientAppointmentController {
  constructor(
    private readonly _GetPatientQueueStatusUseCase: GetPatientQueueStatusUseCase,
    private readonly _GetPatientAppointmentsUseCase: GetPatientAppointmentsUseCase,
    private readonly _CancelAppointmentUseCase: CancelAppointmentUseCase,
    private readonly _CheckCancelEligibilityUseCase: CheckCancelEligibilityUseCase,
    private readonly _CheckRescheduleEligibilityUseCase: CheckRescheduleEligibilityUseCase,
    private readonly _RescheduleAppointmentUseCase: RescheduleAppointmentUseCase
  ) {}

  getLiveQueue = async (req: Request, res: Response) => {
    const appointmentId = req.params.id;
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const formattedDate = tomorrow.toISOString().slice(0, 10);

    const result = await this._GetPatientQueueStatusUseCase.execute(appointmentId, formattedDate);

    return ApiResponse.success(res, result, "Live queue status");
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

    console.log("the result", result);

    return ApiResponse.success(
      res,
      { data: result.data.map(mapAppointmentToResponse), total: result.total },
      "Patient Appointment fetched successfully"
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
