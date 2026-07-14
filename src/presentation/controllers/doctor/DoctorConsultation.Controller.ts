import { Request, Response } from "express";
import { ApiResponse } from "../../utils/common.response.model";
import { mapPatientToDTO } from "../../../applications/dtos/doctor/consultationPatientMapper";
import { GetActiveDoctorOnlineConsultationUseCase } from "../../../applications/usecases/doctor/consultation/online/GetActiveDoctorConsultationUseCase";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";
import { IStartConsultationUseCase } from "../../../domain/usecase/doctor/consultation/IStartConsultationUseCase";
import { IGetPatientOverviewUseCase } from "../../../domain/usecase/doctor/consultation/IGetPatientOverviewUseCase";
import { ISaveQuickNoteUseCase } from "../../../domain/usecase/doctor/consultation/ISaveQuickNoteUseCase";
import { ICompleteConsultationUseCase } from "../../../domain/usecase/doctor/consultation/ICompleteConsultationUseCase";
import { IMarkAsNoShowUseCase } from "../../../domain/usecase/doctor/consultation/IMarkAsNoShowUseCase";
import { IGetConsultationVideoTokenDoctorUseCase } from "../../../domain/usecase/doctor/consultation/online/IGetConsultationVideoTokenDoctorUseCase";
import { IEndConsultationOnlineUseCase } from "../../../domain/usecase/doctor/consultation/online/IEndConsultationOnlineUseCase";
import { IUpdateMedicalRecordPercriptionUseCase } from "../../../domain/usecase/doctor/consultation/IUpdateMedicalRecordPercriptionUseCase";
import { IGetMedicalHistoryUseCase } from "../../../domain/usecase/doctor/consultation/IGetMedicalHistoryUseCase";
import { IGetMedicalRecordWithDoctorInfoUseCase } from "../../../domain/usecase/doctor/consultation/IMedicalRecordRepository";
import { DoctorMessages } from "../../constants/message/doctor.message";
import { ICreateLabOrderUseCase } from "../../../domain/usecase/doctor/consultation/ICreateLabOrderUseCase";
import { IGetMedicalRecordLabTestsUseCase } from "../../../domain/usecase/doctor/consultation/IGetMedicalRecordLabTestsUseCase";
import { MedicalRecordPrescriptionMapper } from "../../../applications/mapper/medicalRecord.mapper";

export class DoctorConsultationController {
  constructor(
    private readonly _StartConsultationUseCase: IStartConsultationUseCase,
    private readonly _GetPatientOverViewUseCase: IGetPatientOverviewUseCase,
    private readonly _SaveQuickNoteUseCase: ISaveQuickNoteUseCase,
    private readonly _CompleteConsultationUseCase: ICompleteConsultationUseCase,
    private readonly _MarkAsNoShowUseCase: IMarkAsNoShowUseCase,
    private readonly _GetConsultationVideoTokenUseCase: IGetConsultationVideoTokenDoctorUseCase,
    private readonly _GetActiveDoctorOnlineConsultationUseCase: GetActiveDoctorOnlineConsultationUseCase,
    private readonly _EndConsultationOnlineUseCase: IEndConsultationOnlineUseCase,
    private readonly _UpdateMedicalRecordPercriptionUseCase: IUpdateMedicalRecordPercriptionUseCase,
    private readonly _GetMedicalHistoryUseCase: IGetMedicalHistoryUseCase,
    private readonly _GetMedicalRecordWithDoctorInfoUseCase: IGetMedicalRecordWithDoctorInfoUseCase,
    private readonly _CreateLabOrderUseCase: ICreateLabOrderUseCase,
    private readonly _GetMedicalRecordLabTestsUseCase: IGetMedicalRecordLabTestsUseCase
  ) {}

  startConsultation = async (req: Request, res: Response) => {
    const { appointmentId } = req.params;

    const result = await this._StartConsultationUseCase.execute(appointmentId);

    ApiResponse.success(res, result, DoctorMessages.CONSULTATION_STARTED);
    return;
  };

  getPatientOverviewForConsulation = async (req: Request, res: Response) => {
    const appointmentId = req.params.id;
    const result = await this._GetPatientOverViewUseCase.execute(appointmentId);
    const patientDTO = mapPatientToDTO(result);
    ApiResponse.success(res, patientDTO);
    return;
  };

  saveQuickObservationNote = async (req: Request, res: Response) => {
    const { id: appointmentId } = req.params;
    const note = req.body?.observationNote;
    const result = await this._SaveQuickNoteUseCase.execute(appointmentId, note);

    ApiResponse.success(res, null, result.message, HttpStatusCode.CREATED);
    return;
  };

  completeConsultation = async (req: Request, res: Response) => {
    const { appointmentId } = req.params;
    const doctorId = req.user?.doctorId;

    const result = await this._CompleteConsultationUseCase.execute(
      appointmentId as string,
      doctorId as string
    );

    ApiResponse.success(res, null, result.message, HttpStatusCode.CREATED);
    return;
  };

  MarkAsNoShow = async (req: Request, res: Response) => {
    const { appointmentId } = req.params;
    const doctorId = req.user?.doctorId;

    const result = await this._MarkAsNoShowUseCase.execute(
      appointmentId as string,
      doctorId as string
    );

    ApiResponse.success(res, null, result.message);
    return;
  };

  getVideoToken = async (req: Request, res: Response) => {
    const { consultationId } = req.body;
    const doctorId = req.user?.doctorId;

    const result = await this._GetConsultationVideoTokenUseCase.execute(consultationId, doctorId);

    ApiResponse.success(res, result);
    return;
  };

  getActiveDoctorConsultation = async (req: Request, res: Response) => {
    const doctorId = req.user?.doctorId;

    const result = await this._GetActiveDoctorOnlineConsultationUseCase.execute(doctorId!);

    ApiResponse.success(res, result);
    return;
  };

  EndConsultationOnline = async (req: Request, res: Response) => {
    const consultationId = req.body.consultationId;
    await this._EndConsultationOnlineUseCase.execute(consultationId);
    ApiResponse.success(res);
    return;
  };

  savePercritption = async (req: Request, res: Response) => {
    const { id: appointmentId } = req.params;
    const result = await this._UpdateMedicalRecordPercriptionUseCase.execute({
      ...req.body,
      appointmentId,
    });
    ApiResponse.success(res, null, result.message, HttpStatusCode.CREATED);
    return;
  };

  GetMedicalHistory = async (req: Request, res: Response) => {
    const appointmentId = req.params.id;
    const { page, limit, fromDate, toDate, diagnosis } = req.query;

    const result = await this._GetMedicalHistoryUseCase.execute({
      appointmentId,
      page: Number(page),
      limit: Number(limit),
      fromDate: fromDate as string,
      toDate: toDate as string,
      diagnosisKeyword: diagnosis as string,
    });

    ApiResponse.success(res, result);
    return;
  };

  GetMedicalRecordWithDoctorInfoUseCase = async (req: Request, res: Response) => {
    const { recordId } = req.params;

    const result = await this._GetMedicalRecordWithDoctorInfoUseCase.execute(recordId);

    const response = MedicalRecordPrescriptionMapper.toPrescriptionViewResponse(result);

    ApiResponse.success(res, response);
    return;
  };

  CreateLabOrder = async (req: Request, res: Response) => {
    console.log(req.body);

    const result = await this._CreateLabOrderUseCase.execute({
      appointmentId: req.body.appointmentId,
      action: req.body.action,
      clinicalReason: req.body.clinicalReason,
      tests: req.body.tests,
    });

    ApiResponse.success(res, null, result.message);
  };

  getLabTests = async (req: Request, res: Response) => {
    const medicalRecordId = req.params.id;

    const result = await this._GetMedicalRecordLabTestsUseCase.execute(medicalRecordId);

    ApiResponse.success(res, result);
    return;
  };
}
