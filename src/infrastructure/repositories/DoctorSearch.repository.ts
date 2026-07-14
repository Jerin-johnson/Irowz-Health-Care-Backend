import { PipelineStage } from "mongoose";
import {
  DoctorSearchQueryDTO,
  DoctorSearchRawDTO,
} from "../../applications/dtos/patient/doctor.search.Dto";
import { IDoctorSearchRepository } from "../../domain/repositories/IDoctorSearchRepo";
import { DoctorModel } from "../database/mongo/models/Doctor.model";
import { HospitalSpecialtyModel } from "../database/mongo/models/HospitalSpeciality.model";

export class DoctorSearchMongoRepository implements IDoctorSearchRepository {
  async searchDoctors(
    query: DoctorSearchQueryDTO
  ): Promise<{ items: DoctorSearchRawDTO[]; total: number }> {
    const { search, specialtyId, lat, lng, radiusKm, page, limit } = query;

    console.log("the console log from repo", {
      search,
      specialtyId,
      lat,
      lng,
      radiusKm,
      page,
      limit,
    });

    const skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [];

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
    } else {
      pipeline.push({ $match: { isActive: true } });
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

    let specialtyName;

    if (specialtyId) {
      specialtyName = await HospitalSpecialtyModel.findById(specialtyId);
      // pipeline.push({
      //   $match: {
      //     specialtyId: new Types.ObjectId(specialtyId),
      //   },
      // });
    }

    // if (specialtyId && specialtyName) {
    //   pipeline.push({
    //     $match: {
    //       "specialty.name": { $regex: specialtyName, $options: "i" },
    //     },
    //   });
    // }

    console.log(specialtyName?.name);

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "user.name": { $regex: search, $options: "i" } },
            { "hospital.name": { $regex: search, $options: "i" } },
            { "specialty.name": { $regex: search, $options: "i" } },
            // { "specialty.name": { $regex: specialtyName?.name, $options: "i" } },
            { "specialty.symptoms": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    if (specialtyName) {
      pipeline.push({
        $match: {
          $or: [{ "specialty.name": { $regex: specialtyName?.name, $options: "i" } }],
        },
      });
    }

    let sortStage: Record<string, 1 | -1> = { averageRating: -1 };

    if (query.sortBy === "price") {
      sortStage = {
        consultationFee: query.sortOrder === "desc" ? -1 : 1,
      };
    }

    if (query.sortBy === "rating") {
      sortStage = {
        averageRating: query.sortOrder === "asc" ? 1 : -1,
      };
    }

    if (query.sortBy === "experience") {
      sortStage = {
        experienceYears: query.sortOrder === "asc" ? 1 : -1,
      };
    }
    pipeline.push({
      $facet: {
        items: [
          { $sort: sortStage },
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
