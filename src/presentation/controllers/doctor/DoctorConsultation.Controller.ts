import { StartConsultationUseCase } from "../../../applications/usecases/doctor/consultation/StartConsultation.UseCase";
import { Request, Response } from "express";
import { ApiResponse } from "../../utils/common.response.model";
import { GetPatientOverViewUseCase } from "../../../applications/usecases/doctor/consultation/GetPatientOverview.useCase";
import { mapPatientToDTO } from "../../../applications/dtos/doctor/consultationPatientMapper";
import { SaveQuickNoteUseCase } from "../../../applications/usecases/doctor/consultation/SaveQuickNoteUseCase";
import { CompleteConsultationUseCase } from "../../../applications/usecases/doctor/consultation/CompleteConsultation.UseCase";
import { MarkAsNoShowUseCase } from "../../../applications/usecases/doctor/consultation/MarkAsNoShow.UseCase";
import { GetConsultationVideoTokenDoctorUseCase } from "../../../applications/usecases/doctor/consultation/online/GetConsultationVideoTokenUseCase";
import { GetActiveDoctorOnlineConsultationUseCase } from "../../../applications/usecases/doctor/consultation/online/GetActiveDoctorConsultationUseCase";
import { EndConsultationOnlineUseCase } from "../../../applications/usecases/doctor/consultation/online/EndOnlineConsultationUseCase";

export class DoctorConsultationController {
  constructor(
    private readonly _StartConsultationUseCase: StartConsultationUseCase,
    private readonly _GetPatientOverViewUseCase: GetPatientOverViewUseCase,
    private readonly _SaveQuickNoteUseCase: SaveQuickNoteUseCase,
    private readonly _CompleteConsultationUseCase: CompleteConsultationUseCase,
    private readonly _MarkAsNoShowUseCase: MarkAsNoShowUseCase,
    private readonly _GetConsultationVideoTokenUseCase: GetConsultationVideoTokenDoctorUseCase,
    private readonly _GetActiveDoctorOnlineConsultationUseCase: GetActiveDoctorOnlineConsultationUseCase,
    private readonly _EndConsultationOnlineUseCase: EndConsultationOnlineUseCase
  ) {}

  startConsultation = async (req: Request, res: Response) => {
    const { appointmentId } = req.params;

    const result = await this._StartConsultationUseCase.execute(appointmentId);

    return ApiResponse.success(res, result, "consulation started successfully");
  };

  getPatientOverviewForConsulation = async (req: Request, res: Response) => {
    const appointmentId = req.params.id;
    const result = await this._GetPatientOverViewUseCase.execute(appointmentId);
    const patientDTO = mapPatientToDTO(result);
    console.log(patientDTO, "fdsnfnhdsfn");
    return ApiResponse.success(res, patientDTO);
  };

  saveQuickObservationNote = async (req: Request, res: Response) => {
    const { id: appointmentId } = req.params;
    const note = req.body?.observationNote;
    console.log("does this work");
    const result = await this._SaveQuickNoteUseCase.execute(appointmentId, note);

    return ApiResponse.success(res, null, result.message);
  };

  completeConsultation = async (req: Request, res: Response) => {
    const { appointmentId } = req.params;
    const doctorId = req.user?.doctorId;

    const result = await this._CompleteConsultationUseCase.execute(
      appointmentId as string,
      doctorId as string
    );

    return ApiResponse.success(res, null, result.message);
  };

  MarkAsNoShow = async (req: Request, res: Response) => {
    const { appointmentId } = req.params;
    const doctorId = req.user?.doctorId;

    const result = await this._MarkAsNoShowUseCase.execute(
      appointmentId as string,
      doctorId as string
    );

    return ApiResponse.success(res, null, result.message);
  };

  getVideoToken = async (req: Request, res: Response) => {
    const { consultationId } = req.body;
    const doctorId = req.user?.doctorId;

    const result = await this._GetConsultationVideoTokenUseCase.execute(consultationId, doctorId);

    return ApiResponse.success(res, result);
  };

  getActiveDoctorConsultation = async (req: Request, res: Response) => {
    const doctorId = req.user?.doctorId;

    const result = await this._GetActiveDoctorOnlineConsultationUseCase.execute(doctorId!);

    ApiResponse.success(res, result);
  };

  EndConsultationOnline = async (req: Request, res: Response) => {
    const consultationId = req.body.consultationId;
    await this._EndConsultationOnlineUseCase.execute(consultationId);
    return ApiResponse.success(res);
  };
}
