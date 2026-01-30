import { ObjectId } from "mongoose";
import { MedicalRecordDocument } from "../../infrastructure/database/mongo/models/MedicalRecord.model";

export interface FindMedicalRecordsQuery {
  patientId: string;
  fromDate?: Date;
  toDate?: Date;
  diagnosisKeyword?: string;
  page: number;
  limit: number;
}

export interface PaginatedMedicalRecords {
  data: MedicalRecordDocument[];
  total: number;
}

export interface IMedicalRecordRepository {
  createDraft(data: {
    appointmentId: string | ObjectId;
    patientId: string | ObjectId;
    doctorId: string | ObjectId;
    hospitalId: string | ObjectId;
    visitType: string;
    visitDate: Date;
  }): Promise<MedicalRecordDocument>;

  SaveQuickObservationByAppointmentId(appointmentId: string, note: string): Promise<void>;

  findByAppointmentId(appointmentId: string): Promise<MedicalRecordDocument | null>;

  lockRecord(recordId: string): Promise<void>;

  findById(id: string): Promise<MedicalRecordDocument | null>;

  save(MedicalRecord: MedicalRecordDocument): Promise<void | MedicalRecordDocument | null>;

  findAllByVisitDateDesc(query: FindMedicalRecordsQuery): Promise<PaginatedMedicalRecords>;
}
