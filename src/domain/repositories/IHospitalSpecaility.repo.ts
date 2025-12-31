import { Types } from "mongoose";
import { IHospitalSpecialty } from "../../infrastructure/database/mongo/models/HospitalSpeciality.model";
export interface IHospitalSpecialtyRepository {
  create(
    data: Omit<IHospitalSpecialty, "_id" | "createdAt" | "updatedAt">
  ): Promise<IHospitalSpecialty>;

  findById(id: string): Promise<IHospitalSpecialty | null>;

  blockOrUnblock(id: string, data: { isActive: boolean }): Promise<void>;

  findByHospital(
    hospitalId: string,
    options?: {
      isActive?: boolean;
      search?: string;
    }
  ): Promise<IHospitalSpecialty[]>;

  getAllSpeciality(
    hospitalId: string
  ): Promise<{ _id: string | Types.ObjectId; name: string }[]>;

  updateById(
    id: string,
    hospitalId: string,
    data: Partial<Omit<IHospitalSpecialty, "_id" | "hospitalId">>
  ): Promise<IHospitalSpecialty | null>;

  getPaginated(
    filters: {
      search?: string;
      status?: boolean;
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
  }>;
}
