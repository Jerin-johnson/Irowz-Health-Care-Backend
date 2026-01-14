import { DoctorReviewResponse } from "../../../types/DoctorReviewResponse.type";

export interface IGetReviewUseCase {
  execute(doctorId: string): Promise<DoctorReviewResponse[]>;
}
