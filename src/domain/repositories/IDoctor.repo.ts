import { Types } from "mongoose";
import { DoctorDocument } from "../../infrastructure/database/mongo/models/Doctor.model";

export interface IDoctorRepository {
  create(data: Partial<DoctorDocument>): Promise<DoctorDocument>;

  updateById(
    doctorId: Types.ObjectId,
    data: Partial<DoctorDocument>
  ): Promise<DoctorDocument | null>;

  findById(doctorId: string): Promise<DoctorDocument | null>;

  findByUserId(userId: string): Promise<DoctorDocument | null>;

  findByHospital(
    hospitalId: Types.ObjectId,
    options?: {
      isActive?: boolean;
      specialtyId?: Types.ObjectId;
      search?: string;
    }
  ): Promise<DoctorDocument[]>;

  toggleStatus(doctorId: Types.ObjectId | string, isActive: boolean): Promise<any>;
  getPaginated(
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
    data: any[];
    total: number;
    totalDoctorCount: number;
    activeDoctorCount: number;
  }>;
}
