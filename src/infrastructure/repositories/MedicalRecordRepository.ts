import { ObjectId } from "mongoose";
import { IMedicalRecordRepository } from "../../domain/repositories/IMedicalRecordRepository";
import {
  MedicalRecordDocument,
  MedicalRecordModel,
} from "../database/mongo/models/MedicalRecord.model";

export class MedicalRecordRepository implements IMedicalRecordRepository {
  async createDraft(data: {
    appointmentId: string | ObjectId;
    patientId: string | ObjectId;
    doctorId: string | ObjectId;
    hospitalId: string | ObjectId;
    visitType: string;
    visitDate: Date;
  }): Promise<MedicalRecordDocument> {
    const result = new MedicalRecordModel(data);

    return await result.save();
  }

  async SaveQuickObservationByAppointmentId(appointmentId: string, note: string): Promise<void> {
    await MedicalRecordModel.updateOne({ appointmentId }, { $set: { observationNotes: note } });
  }
  async findByAppointmentId(appointmentId: string) {
    return MedicalRecordModel.findOne({
      appointmentId,
    });
  }

  async lockRecord(recordId: string) {
    await MedicalRecordModel.findByIdAndUpdate(recordId, {
      status: "LOCKED",
    });
  }

  async findById(id: string): Promise<MedicalRecordDocument | null> {
    return await MedicalRecordModel.findById(id);
  }
}
