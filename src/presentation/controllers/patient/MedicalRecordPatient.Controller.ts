import { Request, Response } from "express";
import { ApiResponse } from "../../utils/common.response.model";
import { IGetMedicalHistoryPatientUseCase } from "../../../domain/usecase/patient/medicalRecord/IGetMedicalHistoryPatientUseCase";
import { IGetPatientPercriptionWithDoctorInfoUseCase } from "../../../domain/usecase/patient/medicalRecord/IGetPatientPrescriptionWithDoctorInfoUseCase";
import { IGetPatientLabTestsUseCase } from "../../../domain/usecase/patient/medicalRecord/IGetPatientLabTestsUseCase";
import { MedicalRecordPrescriptionMapper } from "../../../applications/mapper/medicalRecord.mapper";

export class MedicalRecordPatientController {
  constructor(
    private _GetMedicalHistoryPatientUseCase: IGetMedicalHistoryPatientUseCase,
    private _GetPatientPercriptionWithDoctorInfoUseCase: IGetPatientPercriptionWithDoctorInfoUseCase,
    private _GetPatientLabTestsUseCase: IGetPatientLabTestsUseCase
  ) {}

  GetMedicalHistoryPatient = async (req: Request, res: Response) => {
    const patientId = req.user?.userId;
    const { page, limit, fromDate, toDate, diagnosis } = req.query;

    const result = await this._GetMedicalHistoryPatientUseCase.execute({
      patientId: patientId!,
      page: Number(page),
      limit: Number(limit),
      fromDate: fromDate as string,
      toDate: toDate as string,
      diagnosisKeyword: diagnosis as string,
    });

    return ApiResponse.success(res, result);
  };

  GetPatientPercriptionWithDoctorInfo = async (req: Request, res: Response) => {
    const recordId = req.params.id;

    const result = await this._GetPatientPercriptionWithDoctorInfoUseCase.execute(recordId);

    const response = MedicalRecordPrescriptionMapper.toPrescriptionViewResponse(result);

    return ApiResponse.success(res, response);
  };

  GetPatientLabTests = async (req: Request, res: Response) => {
    const medicalRecordId = req.params.id;

    const result = await this._GetPatientLabTestsUseCase.execute(medicalRecordId);

    return ApiResponse.success(res, result);
  };
}
