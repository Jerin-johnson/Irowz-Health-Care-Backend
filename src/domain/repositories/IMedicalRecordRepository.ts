import { ObjectId } from "mongoose";

export interface IMedicalRecordRepository {
  createDraft(data: {
    appointmentId: string | ObjectId;
    patientId: string | ObjectId;
    doctorId: string | ObjectId;
    visitType: string;
    visitDate: Date;
  }): Promise<void>;
}
