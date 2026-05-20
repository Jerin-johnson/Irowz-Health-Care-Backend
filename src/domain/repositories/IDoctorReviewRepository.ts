import { IBaseRepository } from "./base/IBaseRepository";
import { DoctorReviewDocument } from "../../infrastructure/database/mongo/models/DoctorReview.model";
import { Types } from "mongoose";

export interface DoctorReviewLean {
  _id: Types.ObjectId;

  patientId: {
    _id: Types.ObjectId;
    name: string;
  };

  doctorId: Types.ObjectId;

  rating: number;
  comment?: string;

  isActive: boolean;
  isVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface IDoctorReviewRepository extends IBaseRepository<
  Partial<DoctorReviewDocument>,
  Partial<DoctorReviewDocument>,
  Partial<DoctorReviewDocument>
> {
  upsertReview(
    doctorId: string,
    patientId: string,
    rating: number,
    comment?: string
  ): Promise<void>;

  calculateDoctorRating(doctorId: string): Promise<{ averageRating: number; totalReviews: number }>;

  findReviewsByDoctorId(doctorId: string): Promise<DoctorReviewLean[]>;
}
