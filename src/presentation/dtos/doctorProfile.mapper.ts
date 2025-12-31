export interface DoctorProfileViewDTO {
  id: string;

  fullName: string;
  email: string;
  phone: string;

  hospitalName: string;
  specialtyName: string;

  bio: string;
  experienceYears: number;
  consultationFee: number;

  medicalRegistrationNumber: string;
  medicalCouncil: string;

  teleConsultationEnabled: boolean;
}

export class DoctorProfileMapper {
  static toView(dto: any): DoctorProfileViewDTO {
    return {
      id: dto._id,

      fullName: dto.userId.name,
      email: dto.userId.email,
      phone: dto.userId.phone,

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
