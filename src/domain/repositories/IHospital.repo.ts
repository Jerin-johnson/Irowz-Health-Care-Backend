export interface Hospital {
  id: string;
  userId: string;
  name: string;
  registrationNumber: string;
  officialEmail: string;
  phone: string;
  type: "GENERAL" | "SPECIALTY";
  licenseDocumentUrl: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  isVerified: boolean;
  verifiedAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHospitalRepository {
  create(
    data: Omit<Hospital, "id" | "createdAt" | "updatedAt">
  ): Promise<Hospital>;

  findByUserId(userId: string): Promise<Hospital | null>;

  activateHospital(hospitalId: string): Promise<void>;
}
