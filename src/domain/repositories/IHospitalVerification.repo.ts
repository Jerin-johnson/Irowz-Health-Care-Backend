export type HospitalVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface HospitalVerification {
  _id?: string;
  userId: string;
  hospitalName: string;
  registrationNumber: string;
  hospitalAddress: string;
  city: string;
  state: string;
  pincode: string;
  officialEmail: string;
  phone: string;
  password?: string;
  mimeType?: any;
  fileBuffer?: any;
  licenseDocumentUrl: string;
  status: HospitalVerificationStatus;
  adminRemarks?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export type CreateHospitalVerificationRepository = Omit<
  HospitalVerification,
  "createdAt" | "updatedAt"
>;

export type ResumbitHospitalVerficationRepository = Omit<
  HospitalVerification,
  "createdAt"
>;

export interface IHospitalVerificationRepository {
  create(data: any): Promise<HospitalVerification>;

  findPendingByUserId(userId: string): Promise<HospitalVerification | null>;

  findById(id: string): Promise<HospitalVerification | null>;

  updateStatus(
    id: string,
    status: HospitalVerificationStatus,
    adminRemarks?: string
  ): Promise<void>;

  findAllPending(): Promise<HospitalVerification[]>;

  resumbit(
    userId: string,
    input: Partial<ResumbitHospitalVerficationRepository>
  ): Promise<HospitalVerification>;

  update(id: string, data: Partial<HospitalVerification>): Promise<void>;
}
