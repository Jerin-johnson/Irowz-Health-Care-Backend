import { PipelineStage, Types } from "mongoose";
// import type { FilterQuery } from "mongoose";
import { IDoctorRepository, PaginatedDoctorResult } from "../../domain/repositories/IDoctor.repo";
import { DoctorDocument, DoctorLean, DoctorModel } from "../database/mongo/models/Doctor.model";

export class DoctorRepository implements IDoctorRepository {
  async create(data: Partial<DoctorDocument>): Promise<DoctorDocument> {
    const doctor = new DoctorModel(data);
    return await doctor.save();
  }

  async updateById(
    doctorId: Types.ObjectId,
    data: Partial<DoctorDocument>
  ): Promise<DoctorDocument | null> {
    return await DoctorModel.findByIdAndUpdate(
      doctorId,
      { $set: data },
      { new: true, runValidators: true }
    );
  }

  // async findById(doctorId: string): Promise<DoctorDocument | null> {
  //   return await DoctorModel.findById(doctorId)
  //     .populate("hospitalId")
  //     .populate("specialtyId");
  // }

  async findById(doctorId: string): Promise<DoctorLean | null> {
    return (await DoctorModel.findById(doctorId)
      .select(
        "userId hospitalId specialtyId location experienceYears consultationFee bio medicalRegistrationNumber medicalCouncil teleConsultationEnabled averageRating totalReviews isActive createdAt"
      )
      .populate({
        path: "hospitalId",
        select: "name city state isActive",
      })
      .populate({
        path: "specialtyId",
        select: "name description",
      })
      .populate({ path: "userId", select: "name email phone profileImage" })
      .lean()) as DoctorLean | null;
  }

  async findByUserId(userId: string): Promise<DoctorDocument | null> {
    return await DoctorModel.findOne({ userId });
  }

  async getPaginated(
    filters: {
      hospitalId: string;
      search?: string;
      specialtyId?: string;
      isActive?: boolean;
    },
    pagination: {
      skip: number;
      limit: number;
    }
  ): Promise<{
    data: PaginatedDoctorResult[];
    total: number;
    totalDoctorCount: number;
    activeDoctorCount: number;
  }> {
    const { hospitalId, search, specialtyId, isActive } = filters;
    const { skip, limit } = pagination;

    const matchStage: Record<string, unknown> = {
      hospitalId: new Types.ObjectId(hospitalId),
    };

    if (typeof isActive === "boolean") {
      matchStage.isActive = isActive;
    }

    if (specialtyId) {
      matchStage.specialtyId = new Types.ObjectId(specialtyId);
    }

    const searchStage = search
      ? {
          $or: [
            { "user.name": { $regex: search, $options: "i" } },
            { "user.email": { $regex: search, $options: "i" } },
            { "user.phone": { $regex: search, $options: "i" } },
          ],
        }
      : null;

    const pipeline: PipelineStage[] = [
      { $match: matchStage },

      // join user
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      // join specialty
      {
        $lookup: {
          from: "hospitalspecialties",
          localField: "specialtyId",
          foreignField: "_id",
          as: "specialty",
        },
      },
      { $unwind: "$specialty" },
    ];

    if (searchStage) {
      pipeline.push({ $match: searchStage });
    }

    // total count (after filters)
    const totalPipeline = [...pipeline, { $count: "count" }];

    // paginated data
    pipeline.push({ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit });

    const [data, totalResult, totalDoctorCount, activeDoctorCount] = await Promise.all([
      DoctorModel.aggregate(pipeline),
      DoctorModel.aggregate(totalPipeline),
      DoctorModel.countDocuments({
        hospitalId,
      }),
      DoctorModel.countDocuments({
        hospitalId,
        isActive: true,
      }),
    ]);

    return {
      data,
      total: totalResult[0]?.count || 0,
      totalDoctorCount,
      activeDoctorCount,
    };
  }

  async findByHospital(
    hospitalId: Types.ObjectId,
    options?: {
      isActive?: boolean;
      specialtyId?: Types.ObjectId;
      search?: string;
    }
  ): Promise<DoctorDocument[]> {
    const query: Record<string, unknown> = { hospitalId };

    if (typeof options?.isActive === "boolean") {
      query.isActive = options.isActive;
    }

    if (options?.specialtyId) {
      query.specialtyId = options.specialtyId;
    }

    if (options?.search) {
      query.$or = [
        { fullName: { $regex: options.search, $options: "i" } },
        { email: { $regex: options.search, $options: "i" } },
        { phone: { $regex: options.search, $options: "i" } },
      ];
    }

    return await DoctorModel.find(query).sort({ createdAt: -1 }).populate("specialtyId");
  }

  async toggleStatus(doctorId: Types.ObjectId, isActive: boolean): Promise<DoctorDocument | null> {
    const updatedDoctor = await DoctorModel.findByIdAndUpdate(
      doctorId,
      { $set: { isActive } },
      {
        new: true,
        runValidators: true,
      }
    );

    return updatedDoctor;
  }
}
