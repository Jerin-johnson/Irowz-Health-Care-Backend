import { Types } from "mongoose";

export interface HospitalSpecialtyQuery {
  hospitalId: string;

  isActive?: boolean;

  name?: {
    $regex: string;
    $options: string;
  };
}

export interface PaginatedHospitalSpecialty {
  _id: Types.ObjectId;

  hospitalId: Types.ObjectId;

  name: string;
  description: string;

  isActive: boolean;

  symptoms?: string[];

  createdAt?: Date;
  updatedAt?: Date;
}

export interface UniqueSpecialtyResult {
  _id: string | Types.ObjectId;
  name: string;
}
