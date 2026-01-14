export interface Hospital {
  id: string;
  userId: string;
  name: string;
  registrationNumber: string;
  officialEmail: string;
  phone: string;
  type?: "GENERAL" | "SPECIALTY";
  licenseDocumentUrl?: string;
  licenseDocumentKey: string;
  city: string;
  address?: string;
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
  create(data: Omit<Hospital, "id" | "createdAt" | "updatedAt">): Promise<Hospital>;

  findByUserId(userId: string): Promise<Hospital | null>;

  BlockBYUserId(userId: string, status: boolean): Promise<void>;
  findByAdminUserId(userId: string): Promise<{ _id: string } | null>;
  activateHospital(hospitalId: string): Promise<void>;
  findByHospitalId(hospitalId: string): Promise<any>;
  getPaginated(
    filters: {
      search?: string;
      isActive?: boolean;
      city?: string;
    },
    pagination: {
      skip: number;
      limit: number;
    }
  ): Promise<{
    data: any[];
    total: number;
    totalHospitals: number;
    IsActiveHospitalCount: number;
  }>;

  update(id: string, data: any): Promise<any>;
}
