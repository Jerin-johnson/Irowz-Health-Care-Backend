import { Types } from "mongoose";

export interface Hospital {
  id?: string;
  userId: string | Types.ObjectId;
  name: string;
  registrationNumber: string;
  officialEmail: string;
  phone: string;
  type?: "GENERAL" | "SPECIALTY";
  licenseDocumentUrl?: string;
  licenseDocumentKey: string;
  pincode?: string;
  city: string;
  address?: string;
  state: string;
  latitude?: number;
  longitude?: number;
  isVerified: boolean;
  verifiedAt?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HospitalLean {
  _id: string;
  userId: string;

  name: string;
  registrationNumber: string;
  officialEmail: string;
  phone: string;

  type?: "GENERAL" | "SPECIALTY";

  licenseDocumentKey: string;

  city: string;
  state: string;
  address?: string;

  latitude?: number;
  longitude?: number;

  isVerified: boolean;
  isBlocked?: boolean;
  verifiedAt?: Date;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface HospitalPaginationOptions {
  skip: number;
  limit: number;
}

export interface HospitalFilterOptions {
  isActive?: boolean;
  city?: string;
  search?: string;
}

export interface IHospitalRepository {
  create(data: Omit<Hospital, "id" | "createdAt" | "updatedAt">): Promise<Hospital>;

  findByUserId(userId: string): Promise<Hospital | null>;

  BlockBYUserId(userId: string, status: boolean): Promise<void>;
  findByAdminUserId(userId: string): Promise<{ _id: string } | null>;
  activateHospital(hospitalId: string): Promise<void>;
  findByHospitalId(hospitalId: string): Promise<Hospital | null>;
  getPaginated(
    filters: HospitalFilterOptions,
    pagination: HospitalPaginationOptions
  ): Promise<{
    data: Hospital[];
    total: number;
    totalHospitals: number;
    IsActiveHospitalCount: number;
  }>;

  update(id: string, data: Partial<Hospital>): Promise<Hospital | null>;
}
