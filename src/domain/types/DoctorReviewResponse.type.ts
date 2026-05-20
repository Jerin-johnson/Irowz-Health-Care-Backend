export interface DoctorReviewResponse {
  id: string;
  patientName: string;
  date?: Date | string; // or Date | string if you want to tighten later
  rating: number;
  comment: string;
}
