import { ObjectId } from "mongoose";
import {
  FindMedicalRecordsQuery,
  IMedicalRecordRepository,
  LabTestDomain,
  MedicalRecordPopulated,
  PaginatedMedicalRecords,
} from "../../domain/repositories/IMedicalRecordRepository";
import {
  MedicalRecordDocument,
  MedicalRecordModel,
} from "../database/mongo/models/MedicalRecord.model";
import { DoctorModel } from "../database/mongo/models/Doctor.model";
import User from "../database/mongo/models/User.model";
import { HospitalModel } from "../database/mongo/models/Hospital.model";
import { DoctorInfoDTO } from "../../domain/usecase/doctor/consultation/IMedicalRecordRepository";

type PopulatedDoctor = {
  userId?: {
    name?: string;
    email?: string;
    phone?: string;
  };

  specialtyId?: string;

  medicalRegistrationNumber?: string;
  medicalCouncil?: string;
  experienceYears?: number;

  hospitalId?: {
    name?: string;
    city?: string;
    state?: string;
    address?: string;
  };
};

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
    const filter = {
      patientId,
      status: "LOCKED",
    } as {
      patientId: string | ObjectId;
      status: string;
      visitDate?: {
        $gte?: Date;
        $lte?: Date;
      };
      diagnosisSummary?: {
        $regex: string;
        $options: string;
      };
    };

    if (fromDate || toDate) {
      filter.visitDate = {};
      if (fromDate) filter.visitDate.$gte = fromDate;
      if (toDate) filter.visitDate.$lte = toDate;
    }

    if (diagnosisKeyword) {
      filter.diagnosisSummary = {
        $regex: diagnosisKeyword,
        $options: "i",
      };
    }

    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      MedicalRecordModel.find(filter)
        .select("visitDate visitType diagnosisSummary doctorId hospitalId")
        .populate({
          path: "doctorId",
          select: "userId",
          populate: {
            path: "userId",
            select: "name",
          },
        })
        .populate({
          path: "hospitalId",
          select: "name",
        })
        .sort({ visitDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      MedicalRecordModel.countDocuments(filter),
    ]);

    // return { data: records, total };

    return {
      data: records.map((record) => ({
        ...record,
        _id: record._id.toString(),
      })) as MedicalRecordPopulated[],
      total,
    };
  }

  async findMedicalRecordWithDoctorAndHospital(
    recordId: string
  ): Promise<{ medicalRecord: MedicalRecordDocument; doctorInfo: DoctorInfoDTO } | null> {
    const record = await MedicalRecordModel.findById(recordId)
      .populate({
        path: "doctorId",
        model: DoctorModel,
        populate: [
          {
            path: "userId",
            model: User,
            select: "name email phone",
          },
          {
            path: "hospitalId",
            model: HospitalModel,
            select: "name city state address",
          },
        ],
      })
      .lean();

    if (!record) return null;

    const doctor = record.doctorId as PopulatedDoctor;

    const doctorInfo = {
      name: doctor?.userId?.name,
      email: doctor?.userId?.email,
      phone: doctor?.userId?.phone,
      specialization: doctor?.specialtyId,
      medicalRegistrationNumber: doctor?.medicalRegistrationNumber,
      medicalCouncil: doctor?.medicalCouncil,
      experienceYears: doctor?.experienceYears,
      hospital: doctor?.hospitalId
        ? {
            name: doctor.hospitalId.name,
            city: doctor.hospitalId.city,
            state: doctor.hospitalId.state,
            address: doctor.hospitalId.address,
          }
        : null,
    };

    return {
      medicalRecord: record,
      doctorInfo,
    };
  }

  async addLabTests(appointmentId: string, labTests: LabTestDomain[]): Promise<void> {
    await MedicalRecordModel.updateOne(
      { appointmentId },
      { $push: { labTests: { $each: labTests } } }
    );
  }

  async updateSingleLabTestResult(params: {
    appointmentId: string;
    testName: string;
    reportUrl: string;
  }) {
    await MedicalRecordModel.updateOne(
      {
        appointmentId: params.appointmentId,
        "labTests.testName": params.testName,
        "labTests.action": "Hospital",
      },
      {
        $set: {
          "labTests.$.reportUrl": params.reportUrl,
          "labTests.$.status": "RESULT_UPLOADED",
          "labTests.$.uploadedAt": new Date(),
        },
      }
    );
  }

  async getLabTestsByMedicalRecordId(medicalRecordId: string) {
    const record = await MedicalRecordModel.findById(medicalRecordId)
      .select("labTests status")
      .lean();

    if (!record) {
      throw new Error("Medical record not found");
    }

    return {
      medicalRecordId,
      labTests: record.labTests,
    };
  }
}
