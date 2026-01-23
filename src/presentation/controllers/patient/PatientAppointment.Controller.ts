import { GetPatientQueueStatusUseCase } from "../../../applications/usecases/patient/Appointments/GetPatientQueueStatusUseCase";
import { Request, Response } from "express";
import { ApiResponse } from "../../utils/common.response.model";
import { GetPatientAppointmentsUseCase } from "../../../applications/usecases/patient/Appointments/GetAppointment.UseCase";
import { mapAppointmentToResponse } from "../../../applications/dtos/patient/Appointment";

export class PatientAppointmentController {
  constructor(
    private readonly _GetPatientQueueStatusUseCase: GetPatientQueueStatusUseCase,
    private readonly _GetPatientAppointmentsUseCase: GetPatientAppointmentsUseCase
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
}
