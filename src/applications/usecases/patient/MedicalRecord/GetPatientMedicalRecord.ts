import { IMedicalRecordRepository } from "../../../../domain/repositories/IMedicalRecordRepository";
import { mapMedicalRecordToDTO } from "../../../dtos/doctor/medicalRecord.mapper";

interface Input {
  patientId: string;
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  diagnosisKeyword?: string;
}

export class GetMedicalHistoryPatientUseCase {
  constructor(private readonly _medicalRecordRepo: IMedicalRecordRepository) {}

  async execute(input: Input) {
    const page = input.page || 1;
    const limit = input.limit || 10;

    const { data: records, total } = await this._medicalRecordRepo.findAllByVisitDateDesc({
      patientId: input.patientId,
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
