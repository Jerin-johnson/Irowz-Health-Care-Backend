import { ObjectId } from "mongoose";
import {
  FindMedicalRecordsQuery,
  IMedicalRecordRepository,
  PaginatedMedicalRecords,
} from "../../domain/repositories/IMedicalRecordRepository";
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

  async save(MedicalRecord: MedicalRecordDocument): Promise<void | MedicalRecordDocument | null> {
    return await MedicalRecord.save();
  }

  async findAllByVisitDateDesc({
    patientId,
    fromDate,
    toDate,
    diagnosisKeyword,
    page,
    limit,
  }: FindMedicalRecordsQuery): Promise<PaginatedMedicalRecords> {
    const filter: any = {
      patientId,
    };

    // Date range filter
    if (fromDate || toDate) {
      filter.visitDate = {};
      if (fromDate) filter.visitDate.$gte = fromDate;
      if (toDate) filter.visitDate.$lte = toDate;
    }

    // Diagnosis keyword search
    if (diagnosisKeyword) {
      filter.diagnosisSummary = {
        $regex: diagnosisKeyword,
        $options: "i",
      };
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      MedicalRecordModel.find(filter)
        .select("visitDate visitType diagnosisSummary status doctorId")
        .populate("doctorId", "fullName")
        .sort({ visitDate: -1 }) // 🔑 DESC
        .skip(skip)
        .limit(limit)
        .lean(),

      MedicalRecordModel.countDocuments(filter),
    ]);

    return { data, total };
  }
}
