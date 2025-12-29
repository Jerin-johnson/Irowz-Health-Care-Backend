import { IHospitalSpecialty } from "../../infrastructure/database/mongo/models/HospitalSpeciality.model";
export interface IHospitalSpecialtyRepository {
  create(
    data: Omit<IHospitalSpecialty, "_id" | "createdAt" | "updatedAt">
  ): Promise<IHospitalSpecialty>;

  findById(id: string): Promise<IHospitalSpecialty | null>;

  findByHospital(
    hospitalId: string,
    options?: {
      isActive?: boolean;
      search?: string;
    }
  ): Promise<IHospitalSpecialty[]>;

  updateById(
    id: string,
    data: Partial<Omit<IHospitalSpecialty, "_id" | "hospitalId">>
  ): Promise<IHospitalSpecialty | null>;

  getPaginated(
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
  }>;
}
