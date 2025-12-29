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
    id: string,
    data: Partial<Omit<IHospitalSpecialty, "_id" | "hospitalId">>
  ): Promise<IHospitalSpecialty | null> {
    const updated = await HospitalSpecialtyModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).lean();

    return updated;
  }

  async getPaginated(
    filters: {
      search?: string;
      status?: boolean;
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
    const query: any = {};

    if (filters.search) {
      query.name = {
        $regex: filters.search,
        $options: "i",
      };
    }

    if (typeof filters.status === "boolean") {
      query.isActive = filters.status;
    }

    const dataPromise = HospitalSpecialtyModel.find(query)
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean();

    const totalPromise = HospitalSpecialtyModel.countDocuments(query);
    const totalSpecialityCountPromise = HospitalSpecialtyModel.countDocuments(
      {}
    );
    const activeSpecialityCountPromise = HospitalSpecialtyModel.countDocuments({
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
