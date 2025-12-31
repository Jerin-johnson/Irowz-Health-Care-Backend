import { Types } from "mongoose";

export interface AdminCreateDoctorDTO {
  hospitalId: Types.ObjectId | string;
  specialtyId: Types.ObjectId | string;

  experienceYears: number;
  consultationFee: number;
  bio: string;

  medicalRegistrationNumber: string;
  medicalCouncil: "MCI" | "NMC" | "STATE_MEDICAL_COUNCIL";

  teleConsultationEnabled?: boolean;

  fullName: string;
  email: string;
  phone: string;
}
