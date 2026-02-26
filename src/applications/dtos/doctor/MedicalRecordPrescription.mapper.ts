import { MedicalRecordDocument } from "../../../infrastructure/database/mongo/models/MedicalRecord.model";

export interface BackendHospitalInfoDTO {
  name: string;
  city: string;
  state: string;
  address?: string;
}

export interface BackendDoctorInfoDTO {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  medicalRegistrationNumber: string;
  medicalCouncil: "MCI" | "NMC" | "STATE_MEDICAL_COUNCIL";
  experienceYears: number;
  hospital?: BackendHospitalInfoDTO;
}

export interface GetMedicalRecordWithDoctorInfoResultDTO {
  medicalRecord: MedicalRecordDocument;
  doctorInfo: BackendDoctorInfoDTO;
}

export interface Prescription {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

// labTests: {
//     testName: string;
//     description?: string;

//     action: "Hospital" | "Outside";

//     reportUrl?: string;

//     status: "ORDERED" | "RESULT_UPLOADED" | "REVIEWED";

//     orderedAt: Date;
//     uploadedAt?: Date;
//   }[];

export interface LabTest {
  testName: string;
  description?: string;
  reportUrl?: string;
  status: "ORDERED" | "RESULT_UPLOADED" | "REVIEWED";
}

export interface MedicalRecordResponseDTO {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  hospitalId?: string;

  visitType: "OPD" | "ONLINE";
  visitDate: Date;

  diagnosisSummary?: string;
  observationNotes?: string;
  clinicalObservations?: string;

  prescriptions: Prescription[];
  labTests: LabTest[];

  followUpDate?: Date;

  status: "DRAFT" | "COMPLETED" | "LOCKED";
  externalUpload: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorInfoResponseDTO {
  name: string;
  specialization: string;
  registrationNumber: string;
  hospital: string;
}

export interface PrescriptionViewResponseDTO {
  medicalRecord: MedicalRecordResponseDTO;
  doctorInfo: DoctorInfoResponseDTO;
}
