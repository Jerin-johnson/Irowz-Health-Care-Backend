export type HospitalVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface HospitalVerification {
  userId: string;
  hospitalName: string;
  registrationNumber: string;
  hospitalAddress: string;
  city: string;
  state: string;
  pincode: string;
  officialEmail: string;
  phone: string;
  licenseDocument: string;
  status: HospitalVerificationStatus;
  adminRemarks?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateHospitalVerificationRepository = Omit<
  HospitalVerification,
  "status" | "createdAt" | "updatedAt"
>;

export interface HospitalVerificationRepository {
  create(
    data: CreateHospitalVerificationRepository
  ): Promise<HospitalVerification>;

  findPendingByUserId(userId: string): Promise<HospitalVerification | null>;

  findById(id: string): Promise<HospitalVerification | null>;

  updateStatus(
    id: string,
    status: HospitalVerificationStatus,
    adminRemarks?: string
  ): Promise<void>;

  findAllPending(): Promise<HospitalVerification[]>;
}
