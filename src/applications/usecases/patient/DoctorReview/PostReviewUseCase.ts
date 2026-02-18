import {
  IPostReviewUseCase,
  PostDoctorReviewDTO,
} from "../../../../domain/usecase/patient/DoctorReview/IPostReviewUseCase";
import { IDoctorReviewRepository } from "../../../../domain/repositories/IDoctorReviewRepository";
import { IDoctorRepository } from "../../../../domain/repositories/IDoctor.repo";
import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";

export class PostReviewUseCase implements IPostReviewUseCase {
  constructor(
    private readonly doctorReviewRepo: IDoctorReviewRepository,
    private readonly doctorRepo: IDoctorRepository,
    private readonly doctorappointmentRepo: IDoctorAppointmentRepository
  ) {}

  async execute({ doctorId, patientId, rating, comment }: PostDoctorReviewDTO): Promise<void> {
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const appointment = await this.doctorappointmentRepo.findByUserIdCompelted(patientId);

    console.log("the appointment is", appointment);

    if (!appointment)
      throw new Error("sorry please compelete a consultation with doctor and then post review");

    await this.doctorReviewRepo.upsertReview(doctorId, patientId, rating, comment);

    const stats = await this.doctorReviewRepo.calculateDoctorRating(doctorId);

    await this.doctorRepo.updateById(doctorId, {
      averageRating: stats.averageRating,
      totalReviews: stats.totalReviews,
    });
  }
}
