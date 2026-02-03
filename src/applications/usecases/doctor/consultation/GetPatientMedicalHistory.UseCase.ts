import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { IMedicalRecordRepository } from "../../../../domain/repositories/IMedicalRecordRepository";
import { IGetMedicalHistoryUseCase } from "../../../../domain/usecase/doctor/consultation/IGetMedicalHistoryUseCase";
import { mapMedicalRecordToDTO } from "../../../dtos/doctor/medicalRecord.mapper";

interface Input {
  appointmentId: string;
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  diagnosisKeyword?: string;
}

export class GetMedicalHistoryUseCase implements IGetMedicalHistoryUseCase {
  constructor(
    private readonly _medicalRecordRepo: IMedicalRecordRepository,
    private readonly _doctorAppoinmentRepo: IDoctorAppointmentRepository
  ) {}

  async execute(input: Input) {
    const page = input.page || 1;
    const limit = input.limit || 10;

    const appoinment = await this._doctorAppoinmentRepo.findById(input.appointmentId);

    if (!appoinment) throw new Error("THe appointment repo is missing");

    const { data: records, total } = await this._medicalRecordRepo.findAllByVisitDateDesc({
      patientId: String(appoinment.patientId),
      page,
      limit,
      fromDate: input.fromDate ? new Date(input.fromDate) : undefined,
      toDate: input.toDate ? new Date(input.toDate) : undefined,
      diagnosisKeyword: input.diagnosisKeyword,
    });

    console.log(records);

    return {
      data: records.map(mapMedicalRecordToDTO),
      pagination: {
        total,
        page,
        limit,
      },
    };
  }
}
