import { Types } from "mongoose";

export interface DoctorReviewResponse {
  id: string;
  patientName: string;
  date: string | Date;
  rating: number;
  comment: string;
}

// interface ReviewMapperInput {
//   _id: Types.ObjectId | string;

//   updatedAt: Date | string;

//   rating: number;

//   comment: string;

//   patientId?: {
//     name?: string;
//   };
// }

export const mapDoctorReviews = (reviews: any[]): DoctorReviewResponse[] => {
  return reviews.map((review) => ({
    id: review._id.toString(),
    patientName: review.patientId?.name ?? "Anonymous",
    date: review.updatedAt,
    rating: review.rating,
    comment: review.comment,
  }));
};
