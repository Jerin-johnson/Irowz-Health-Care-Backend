import { MedicalRecordDocument } from "../../../../infrastructure/database/mongo/models/MedicalRecord.model";

export interface DoctorInfo {
  doctorId: string;
  name: string;
  specialization?: string;
  phone?: string;
  email?: string;
  hospitalName?: string;
}

export interface IGetMedicalRecordWithDoctorInfoUseCase {
  execute(recordId: string): Promise<{
    medicalRecord: MedicalRecordDocument;
    doctorInfo: DoctorInfo;
  } | null>;
}
