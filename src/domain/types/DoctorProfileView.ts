export interface DoctorProfileViewDTO {
  id: string;

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
