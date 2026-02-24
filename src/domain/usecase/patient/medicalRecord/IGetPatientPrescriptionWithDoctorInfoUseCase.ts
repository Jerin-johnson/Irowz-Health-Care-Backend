import { BackendDoctorInfoDTO } from "../../../../applications/dtos/doctor/MedicalRecordPrescription.mapper";
import { MedicalRecordDocument } from "../../../../infrastructure/database/mongo/models/MedicalRecord.model";

export interface GetPatientPrescriptionWithDoctorInfoResponse {
  medicalRecord: MedicalRecordDocument;
  doctorInfo: BackendDoctorInfoDTO;
}

export interface IGetPatientPercriptionWithDoctorInfoUseCase {
  execute(recordId: string): Promise<GetPatientPrescriptionWithDoctorInfoResponse>;
}
