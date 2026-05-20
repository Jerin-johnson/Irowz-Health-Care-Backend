import { IDoctorReviewRepository } from "../../../../domain/repositories/IDoctorReviewRepository";
import { IGetReviewUseCase } from "../../../../domain/usecase/patient/DoctorReview/IGetReviewUseCase";
import { mapDoctorReviews } from "../../../mapper/doctorReview.mapper";

export class GetReviewUseCase implements IGetReviewUseCase {
  constructor(private readonly _doctorReviewRepo: IDoctorReviewRepository) {}

  async execute(doctorId: string): Promise<
    | {
        id: string;
        patientName: string;
        date: string | Date;
        rating: number;
        comment: string;
      }[]
    | []
  > {
    const result = await this._doctorReviewRepo.findReviewsByDoctorId(doctorId);
    console.log("The result is ", result);

    return mapDoctorReviews(result) as {
      id: string;
      patientName: string;
      date: string;
      rating: number;
      comment: string;
    }[];
  }
}
