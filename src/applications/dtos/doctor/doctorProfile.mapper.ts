import { Types } from "mongoose";
import { DoctorLean } from "../../../infrastructure/database/mongo/models/Doctor.model";

export interface DoctorProfileViewDTO {
  id: string | Types.ObjectId;

  fullName: string;
  email: string;
  phone: string;

  hospitalName: string;
  specialtyName: string;
  profileImage: string;
  bio: string;
  experienceYears: number;
  consultationFee: number;

  medicalRegistrationNumber: string;
  medicalCouncil: string;

  teleConsultationEnabled: boolean;
}

export class DoctorProfileMapper {
  static toView(dto: DoctorLean): DoctorProfileViewDTO {
    console.log(dto);
    return {
      id: String(dto._id),

      fullName: dto.userId.name,
      email: dto.userId.email,
      phone: dto.userId.phone,
      profileImage: dto.userId.profileImage,
      hospitalName: dto.hospitalId.name,
      specialtyName: dto.specialtyId.name,

      bio: dto.bio,
      experienceYears: dto.experienceYears,
      consultationFee: dto.consultationFee,

      medicalRegistrationNumber: dto.medicalRegistrationNumber,
      medicalCouncil: dto.medicalCouncil,

      teleConsultationEnabled: dto.teleConsultationEnabled,
    };
  }
}
