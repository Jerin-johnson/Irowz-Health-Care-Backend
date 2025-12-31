import { Types } from "mongoose";
import { IHospitalSpecialtyRepository } from "../../domain/repositories/IHospitalSpecaility.repo";
import {
  HospitalSpecialtyModel,
  IHospitalSpecialty,
} from "../database/mongo/models/HospitalSpeciality.model";

export class HospitalSpecialtyRepositoryImpl implements IHospitalSpecialtyRepository {
  async create(
    data: Omit<IHospitalSpecialty, "_id" | "createdAt" | "updatedAt">
  ): Promise<IHospitalSpecialty> {
    const specialty = await HospitalSpecialtyModel.create(data);
    return specialty.toObject();
  }

  async findById(id: string): Promise<IHospitalSpecialty | null> {
    const specialty = await HospitalSpecialtyModel.findById(id).lean();
    return specialty;
  }

  async findByHospital(
    hospitalId: string,
    options?: {
      isActive?: boolean;
      search?: string;
    }
  ): Promise<IHospitalSpecialty[]> {
    const filter: any = {
      hospitalId,
    };

    if (typeof options?.isActive === "boolean") {
      filter.isActive = options.isActive;
    }

    if (options?.search) {
      filter.name = {
        $regex: options.search,
        $options: "i",
      };
    }

    return HospitalSpecialtyModel.find(filter).sort({ createdAt: -1 }).lean();
  }

  /* =====================================================
     UPDATE BY ID
  ===================================================== */

  async updateById(
    specialtyId: string,
    hospitalId: string,
    data: { name: string; description: string }
  ) {
    return HospitalSpecialtyModel.findOneAndUpdate(
      { _id: specialtyId, hospitalId },
      { $set: data },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async blockOrUnblock(id: string, data: { isActive: boolean }): Promise<void> {
    await HospitalSpecialtyModel.findOneAndUpdate(
      { _id: id },
      { $set: data },
      {
        new: true,
        runValidators: true,
      }
    );
  }
  async getAllSpeciality(
    hospitalId: string
  ): Promise<{ _id: string | Types.ObjectId; name: string }[]> {
    const result = await HospitalSpecialtyModel.find({
      hospitalId: hospitalId,
    })
      .select("_id name")
      .lean();
    return result;
  }

  async getPaginated(
    filters: {
      search?: string;
      isActive?: boolean;
      hospitalId: string;
    },
    pagination: {
      skip: number;
      limit: number;
    }
  ): Promise<{
    data: any[];
    total: number;
    totalSpecialityCount: number;
    activeSpecialityCount: number;
  }> {
    const query: any = { hospitalId: filters.hospitalId };

    if (filters.search) {
      query.name = {
        $regex: filters.search,
        $options: "i",
      };
    }

    if (typeof filters.isActive === "boolean") {
      query.isActive = filters.isActive;
    }

    const dataPromise = HospitalSpecialtyModel.find(query)
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean();

    const totalPromise = HospitalSpecialtyModel.countDocuments(query);
    const totalSpecialityCountPromise = HospitalSpecialtyModel.countDocuments({
      hospitalId: filters.hospitalId,
    });
    const activeSpecialityCountPromise = HospitalSpecialtyModel.countDocuments({
      hospitalId: filters.hospitalId,
      isActive: true,
    });

    const [data, total, totalSpecialityCount, activeSpecialityCount] =
      await Promise.all([
        dataPromise,
        totalPromise,
        totalSpecialityCountPromise,
        activeSpecialityCountPromise,
      ]);

    return {
      data,
      total,
      totalSpecialityCount,
      activeSpecialityCount,
    };
  }
}
