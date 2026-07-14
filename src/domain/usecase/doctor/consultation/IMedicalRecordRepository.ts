import { MedicalRecordDocument } from "../../../../infrastructure/database/mongo/models/MedicalRecord.model";

// export interface DoctorInfo {
//   doctorId: string;
//   name: string;
//   specialization?: string;
//   phone?: string;
//   email?: string;
//   hospitalName?: string;
// }

export interface BackendHospitalInfoDTO {
  name: string;
  city: string;
  state: string;
  address?: string;
}

// export interface DoctorInfoDTO {
//   name?: string;
//   email: string;
//   phone: string;
//   specialization: string;
//   medicalRegistrationNumber: string;
//   medicalCouncil: "MCI" | "NMC" | "STATE_MEDICAL_COUNCIL";
//   experienceYears: number;
//   hospital?: BackendHospitalInfoDTO;
// }

export interface DoctorInfoDTO {
  name?: string;
  email?: string;
  phone?: string;

  specialization?: string;
  medicalRegistrationNumber?: string;
  medicalCouncil?: string;
  experienceYears?: number;

  hospital: {
    name?: string;
    city?: string;
    state?: string;
    address?: string;
  } | null;
}

export interface IGetMedicalRecordWithDoctorInfoUseCase {
  execute(recordId: string): Promise<{
    medicalRecord: MedicalRecordDocument;
    doctorInfo: DoctorInfoDTO;
  }>;
}
