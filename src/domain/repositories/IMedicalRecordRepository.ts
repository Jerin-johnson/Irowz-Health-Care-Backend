import { ObjectId } from "mongoose";
import { MedicalRecordDocument } from "../../infrastructure/database/mongo/models/MedicalRecord.model";
import { DoctorInfoDTO } from "../usecase/doctor/consultation/IMedicalRecordRepository";
// import { DoctorInfo } from "../usecase/doctor/consultation/IMedicalRecordRepository";

export interface LabTestDTO {
  testName: string;
  description?: string;
  action: "Hospital" | "Outside";
  reportUrl?: string;
  status: "ORDERED" | "RESULT_UPLOADED" | "REVIEWED";
  orderedAt: Date;
  uploadedAt?: Date;
}

export interface LabTestsByRecordResult {
  medicalRecordId: string;
  labTests: LabTestDTO[];
}

export interface FindMedicalRecordsQuery {
  patientId: string;
  fromDate?: Date;
  toDate?: Date;
  diagnosisKeyword?: string;
  page: number;
  limit: number;
}

export interface MedicalRecordPopulated {
  _id: ObjectId | string;
  visitDate: Date;
  diagnosisSummary?: string;
  visitType: string;

  doctorId?: {
    userId?: {
      name?: string;
    };
  };

  hospitalId?: {
    name?: string;
  };
}

export interface PaginatedMedicalRecords {
  data: MedicalRecordPopulated[];
  total: number;
}

export type LabAction = "Hospital" | "Outside";

export interface LabTestDomain {
  testName: string;
  description?: string;
  action: LabAction;
  status: "ORDERED" | "RESULT_UPLOADED" | "REVIEWED";
  orderedAt: Date;
  uploadedAt?: Date;
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

  findMedicalRecordWithDoctorAndHospital(recordId: string): Promise<{
    medicalRecord: MedicalRecordDocument;
    doctorInfo: DoctorInfoDTO;
  } | null>;

  addLabTests(appointmentId: string, labTests: LabTestDomain[]): Promise<void>;

  updateSingleLabTestResult(params: {
    appointmentId: string;
    testName: string;
    reportUrl: string;
  }): Promise<void>;

  getLabTestsByMedicalRecordId(medicalRecordId: string): Promise<LabTestsByRecordResult>;
}
