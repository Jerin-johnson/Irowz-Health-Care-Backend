import { IBaseRepository } from "./base/IBaseRepository";
import { DoctorReviewDocument } from "../../infrastructure/database/mongo/models/DoctorReview.model";

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

  findReviewsByDoctorId(doctorId: string): Promise<any>;
}
