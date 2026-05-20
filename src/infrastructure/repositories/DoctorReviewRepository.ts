import { Types } from "mongoose";
import {
  DoctorReviewDocument,
  DoctorReviewModel,
} from "../database/mongo/models/DoctorReview.model";
import { BaseRepository } from "./base/Base.repository";
import {
  DoctorReviewLean,
  IDoctorReviewRepository,
} from "../../domain/repositories/IDoctorReviewRepository";

export class DoctorReviewRepository
  extends BaseRepository<
    Partial<DoctorReviewDocument>,
    Partial<DoctorReviewDocument>,
    Partial<DoctorReviewDocument>
  >
  implements IDoctorReviewRepository
{
  constructor() {
    super(DoctorReviewModel);
  }

  async upsertReview(
    doctorId: string,
    patientId: string,
    rating: number,
    comment?: string
  ): Promise<void> {
    await DoctorReviewModel.findOneAndUpdate(
      { doctorId, patientId },
      {
        $set: {
          rating,
          comment,
          isVerified: true,
          isActive: true,
        },
      },
      { upsert: true }
    );
  }

  async calculateDoctorRating(doctorId: string) {
    const stats = await DoctorReviewModel.aggregate([
      {
        $match: {
          doctorId: new Types.ObjectId(doctorId),
          isActive: true,
          isVerified: true,
        },
      },
      {
        $group: {
          _id: "$doctorId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    return {
      averageRating: stats[0]?.averageRating || 0,
      totalReviews: stats[0]?.totalReviews || 0,
    };
  }

  async findReviewsByDoctorId(doctorId: string): Promise<DoctorReviewLean[]> {
    return DoctorReviewModel.find({ doctorId })
      .populate({
        path: "patientId",
        select: "name",
      })
      .lean<DoctorReviewLean[]>();
  }
}
