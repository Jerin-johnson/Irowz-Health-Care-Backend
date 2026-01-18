import { Types } from "mongoose";

export interface DoctorSearchQueryDTO {
  search?: string;
  specialtyId?: Types.ObjectId;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  page: number;
  limit: number;
  sortBy?: "rating" | "price" | "experience" | string | null;
  sortOrder?: "asc" | "desc" | string | null;
}

export interface DoctorSearchRawDTO {
  _id: Types.ObjectId;
  fullName: string;
  consultationFee: number;
  experienceYears: number;
  averageRating: number;
  totalReviews: number;
  distance?: number;

  user: {
    name: string;
    email: string;
    profileImage?: string;
  };

  hospital: {
    _id: Types.ObjectId;
    name: string;
    city: string;
  };

  specialty: {
    _id: Types.ObjectId;
    name: string;
    symptoms: string[];
  };
}

export interface DoctorSearchResponseDTO {
  id: string;
  fullName: string;
  consultationFee: number;
  experienceYears: number;
  averageRating: number;
  totalReviews: number;

  hospitalName: string;
  hospitalCity: string;
  specialtyName: string;

  isAvailableToday: boolean;
  availableDays: string[];
}
