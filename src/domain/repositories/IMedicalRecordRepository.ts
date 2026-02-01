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

// interface Prescription {
//   medicineName: string;
//   dosage: string;
//   frequency: string;
//   duration: string;
//   instructions?: string;
// }

// interface LabTest {
//   testName: string;
//   description?: string;
//   reportUrl?: string;
//   status: "ORDERED" | "RECEIVED";
// }

// interface MedicalRecord {
//   appointmentId: string;
//   patientId: string;
//   doctorId: string;
//   hospitalId?: string;
//   visitType: "OPD" | "ONLINE";
//   visitDate: Date;
//   diagnosisSummary?: string;
//   observationNotes?: string;
//   clinicalObservations?: string;
//   prescriptions: Prescription[];
//   labTests: LabTest[];
//   followUpDate?: Date;
//   status: "DRAFT" | "COMPLETED" | "LOCKED";
//   externalUpload: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

// interface DoctorInfo {
//   name: string;
//   specialization: string;
//   registrationNumber: string;
//   hospital: string;
// }

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
    doctorInfo: any;
  } | null>;
}
