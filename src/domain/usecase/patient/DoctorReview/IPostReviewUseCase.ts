export interface PostDoctorReviewDTO {
  doctorId: string;
  patientId: string;
  rating: number;
  comment?: string;
}

export interface IPostReviewUseCase {
  execute(data: PostDoctorReviewDTO): Promise<void>;
}
