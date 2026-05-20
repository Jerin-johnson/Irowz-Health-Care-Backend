import {
  HospitalVerificationDocument,
  HospitalVerificationModel,
} from "../database/mongo/models/HospitalVerification.model";
import {
  CreateHospitalVerificationInput,
  HospitalVerification,
  HospitalVerificationLean,
  HospitalVerificationQuery,
  HospitalVerificationStatus,
  IHospitalVerificationRepository,
  ResumbitHospitalVerficationRepository,
} from "../../domain/repositories/IHospitalVerification.repo";
import mongoose from "mongoose";
import { HosptialRequestVerficationStatus } from "../../domain/constants/HosptialRequestVerficationStatus";

export class HospitalVerificationRepository implements IHospitalVerificationRepository {
  async create(data: CreateHospitalVerificationInput) {
    const record = await HospitalVerificationModel.create(data);
    return this.map(record);
  }

  async findPendingByUserId(userId: string) {
    const record = await HospitalVerificationModel.findOne({
      userId,
      status: "PENDING",
    });
    return record ? this.map(record) : null;
  }

  async findById(id: string) {
    const record = await HospitalVerificationModel.findById(id);
    return record ? this.map(record) : null;
  }

  async updateStatus(id: string, status: "APPROVED" | "REJECTED", adminRemarks?: string) {
    const result = await HospitalVerificationModel.findByIdAndUpdate(
      id,
      {
        status,
        adminRemarks,
        reviewedAt: new Date(),
      },
      { new: true }
    );

    if (!result) return;

    return this.map(result);
  }

  async findByIdStatus(id: string): Promise<{ adminRemarks: string; status: string }> {
    const record = await HospitalVerificationModel.findById(id)
      .select("adminRemarks status")
      .lean();
    return record as { adminRemarks: string; status: string };
  }

  async findAllPending(status = "PENDING", search: string) {
    // let query = { status };
    // if (search) {
    //   // query.hos;
    //   console.log(search);
    // }
    console.log(status, search);
    const records = await HospitalVerificationModel.find({
      status: "PENDING",
    });
    return records.map(this.map);
  }

  async resumbit(
    verficationId: string,
    input: Partial<ResumbitHospitalVerficationRepository>
  ): Promise<HospitalVerification | null> {
    const record = await HospitalVerificationModel.findOneAndUpdate(
      { _id: verficationId },
      { ...input }
    );

    if (!record) return null;
    return this.map(record);
  }

  async update(id: string, data: Partial<HospitalVerification>): Promise<void> {
    const objectId = new mongoose.Types.ObjectId(id);
    console.log("what is that", data);
    const updated = await HospitalVerificationModel.findOneAndUpdate(
      { _id: objectId },
      { licenseDocumentKey: data.licenseDocumentKey }
    );
    console.log("This was success");
    if (!updated) {
      throw new Error(`Hospital verification not found for id ${id}`);
    }
  }

  async findHosptialVerficationStatus(
    hositpalId: string
  ): Promise<HospitalVerificationStatus | null> {
    const status = await HospitalVerificationModel.findOne({
      _id: hositpalId,
    }).select("status");

    if (!status) return null;

    return status.status;
  }

  async countByStatus(status: HosptialRequestVerficationStatus): Promise<number> {
    return HospitalVerificationModel.countDocuments({ status });
  }

  async countApprovedToday(): Promise<number> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return HospitalVerificationModel.countDocuments({
      status: HosptialRequestVerficationStatus.APPROVED,
      reviewedAt: { $gte: start, $lte: end },
    });
  }

  async getPaginated(
    filters: {
      search?: string;
      status?: HosptialRequestVerficationStatus;
      city?: string;
    },
    pagination: {
      skip: number;
      limit: number;
    }
  ): Promise<{
    data: HospitalVerificationLean[];
    total: number;
  }> {
    const query: HospitalVerificationQuery = {};

    if (filters.status) query.status = filters.status;
    if (filters.city) query.city = filters.city;

    if (filters.search) {
      query.$or = [
        { hospitalName: { $regex: filters.search, $options: "i" } },
        { registrationNumber: { $regex: filters.search, $options: "i" } },
      ];
    }

    const [data, total] = await Promise.all([
      HospitalVerificationModel.find(query)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .sort({ submittedAt: -1 })
        .lean<HospitalVerificationLean[]>(),
      HospitalVerificationModel.countDocuments(query),
    ]);

    return { data, total };
  }

  private map(doc: HospitalVerificationDocument): HospitalVerification {
    return {
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      hospitalName: doc.hospitalName,
      latitude: doc.latitude,
      longitude: doc.longitude,
      registrationNumber: doc.registrationNumber,
      hospitalAddress: doc.hospitalAddress,
      city: doc.city,
      state: doc.state,
      pincode: doc.pincode,
      officialEmail: doc.officialEmail,
      phone: doc.phone,
      licenseDocumentKey: doc.licenseDocumentKey,
      status: doc.status,
      adminRemarks: doc.adminRemarks,
      submittedAt: doc.submittedAt,
      reviewedAt: doc.reviewedAt,
      createdAt: doc.createdAt as string,
      updatedAt: doc.updatedAt as string,
    };
  }
}
