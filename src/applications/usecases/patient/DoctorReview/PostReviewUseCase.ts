import {
  IPostReviewUseCase,
  PostDoctorReviewDTO,
} from "../../../../domain/usecase/patient/DoctorReview/IPostReviewUseCase";
import { IDoctorReviewRepository } from "../../../../domain/repositories/IDoctorReviewRepository";
import { IDoctorRepository } from "../../../../domain/repositories/IDoctor.repo";

export class PostReviewUseCase implements IPostReviewUseCase {
  constructor(
    private readonly doctorReviewRepo: IDoctorReviewRepository,
    private readonly doctorRepo: IDoctorRepository
  ) {}

  async execute({ doctorId, patientId, rating, comment }: PostDoctorReviewDTO): Promise<void> {
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    await this.doctorReviewRepo.upsertReview(doctorId, patientId, rating, comment);

    const stats = await this.doctorReviewRepo.calculateDoctorRating(doctorId);

    await this.doctorRepo.updateById(doctorId, {
      averageRating: stats.averageRating,
      totalReviews: stats.totalReviews,
    });
  }
}
