export interface DoctorReviewResponse {
  id: string;
  patientName: string;
  date: any;
  rating: number;
  comment: string;
}

export const mapDoctorReviews = (reviews: any[]): DoctorReviewResponse[] => {
  return reviews.map((review) => ({
    id: review._id.toString(),
    patientName: review.patientId?.name ?? "Anonymous",
    date: review.updatedAt,
    rating: review.rating,
    comment: review.comment,
  }));
};
