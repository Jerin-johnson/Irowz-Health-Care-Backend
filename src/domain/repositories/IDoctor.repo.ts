import { Types } from "mongoose";
import {
  DoctorDocument,
  DoctorLean,
} from "../../infrastructure/database/mongo/models/Doctor.model";

export interface PaginatedDoctorResult {
  _id: Types.ObjectId;

  user: {
    _id: Types.ObjectId;
    name: string;
    email: string;
    phone: string;
  };

  specialty: {
    _id: Types.ObjectId;
    name: string;
    description?: string;
  };

  experienceYears: number;
  consultationFee: number;
  averageRating: number;
  isActive: boolean;

  createdAt: Date;
}

export interface IDoctorRepository {
  create(data: Partial<DoctorDocument>): Promise<DoctorDocument>;

  updateById(
    doctorId: Types.ObjectId | string,
    data: Partial<DoctorDocument>
  ): Promise<DoctorDocument | null>;

  findById(doctorId: string): Promise<DoctorLean | null>;

  findByUserId(userId: string): Promise<DoctorDocument | null>;

  findByHospital(
    hospitalId: Types.ObjectId,
    options?: {
      isActive?: boolean;
      specialtyId?: Types.ObjectId;
      search?: string;
    }
  ): Promise<DoctorDocument[]>;

  toggleStatus(
    doctorId: Types.ObjectId | string,
    isActive: boolean
  ): Promise<DoctorDocument | null>;
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
    data: PaginatedDoctorResult[];
    total: number;
    totalDoctorCount: number;
    activeDoctorCount: number;
  }>;
}
