export interface DoctorReviewResponse {
  id: string;
  patientName: string;
  date: any; // or Date | string if you want to tighten later
  rating: number;
  comment: string;
}
