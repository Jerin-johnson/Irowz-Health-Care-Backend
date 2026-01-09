import {
  DoctorSearchQueryDTO,
  DoctorSearchRawDTO,
} from "../../applications/dtos/patient/doctor.search.Dto";
import { IDoctorSearchRepository } from "../../domain/repositories/IDoctorSearchRepo";
import { DoctorModel } from "../database/mongo/models/Doctor.model";

export class DoctorSearchMongoRepository implements IDoctorSearchRepository {
  async searchDoctors(
    query: DoctorSearchQueryDTO
  ): Promise<{ items: DoctorSearchRawDTO[]; total: number }> {
    const { search, specialtyId, lat, lng, radiusKm, page, limit } = query;

    const skip = (page - 1) * limit;

    const pipeline: any[] = [];

    if (lat !== undefined && lng !== undefined && radiusKm !== undefined) {
      pipeline.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          distanceField: "distance",
          maxDistance: radiusKm * 1000,
          spherical: true,
          query: { isActive: true },
        },
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: "hospitals",
          localField: "hospitalId",
          foreignField: "_id",
          as: "hospital",
        },
      },
      { $unwind: "$hospital" }
    );

    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" }
    );

    pipeline.push(
      {
        $lookup: {
          from: "hospitalspecialties",
          localField: "specialtyId",
          foreignField: "_id",
          as: "specialty",
        },
      },
      { $unwind: "$specialty" }
    );

    pipeline.push({ $match: { isActive: true } });

    if (specialtyId) {
      pipeline.push({ $match: { specialtyId } });
    }

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "user.name": { $regex: search, $options: "i" } },
            { "hospital.name": { $regex: search, $options: "i" } },
            { "specialty.name": { $regex: search, $options: "i" } },
            { "specialty.symptoms": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    pipeline.push({
      $facet: {
        items: [
          { $sort: { averageRating: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              fullName: 1,
              consultationFee: 1,
              experienceYears: 1,
              averageRating: 1,
              totalReviews: 1,
              distance: 1,
              user: {
                name: "$user.name",
                email: "$user.email",
                profileImage: "$user.profileImage",
              },
              hospital: {
                _id: "$hospital._id",
                name: "$hospital.name",
                city: "$hospital.city",
              },
              specialty: {
                _id: "$specialty._id",
                name: "$specialty.name",
                symptoms: "$specialty.symptoms",
              },
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    });

    const result = await DoctorModel.aggregate(pipeline);

    const items = result[0]?.items ?? [];
    const total = result[0]?.totalCount?.[0]?.count ?? 0;

    return { items, total };
  }
}
