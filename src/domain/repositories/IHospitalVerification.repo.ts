import { HosptialRequestVerficationStatus } from "../constants/HosptialRequestVerficationStatus";

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
  mimeType?: string;
  fileBuffer?: Buffer;
  licenseDocumentKey: string;
  latitude?: number;
  longitude?: number;
  status: HospitalVerificationStatus;
  adminRemarks?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface HospitalVerificationLean {
  _id: string;

  userId: string;

  hospitalName: string;
  registrationNumber: string;
  hospitalAddress: string;

  city: string;
  state: string;
  pincode: string;

  officialEmail: string;
  phone: string;

  latitude?: number;
  longitude?: number;

  licenseDocumentKey: string;

  status: HospitalVerificationStatus;

  adminRemarks?: string;

  submittedAt: Date;
  reviewedAt?: Date;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateHospitalVerificationInput {
  userId: string;
  hospitalName: string;
  registrationNumber: string;
  hospitalAddress: string;
  city: string;
  state: string;
  pincode: string;
  officialEmail: string;
  phone: string;
  licenseDocumentKey: string;
  latitude?: number;
  longitude?: number;
  submittedAt?: Date | string;
}

export interface HospitalVerificationQuery {
  status?: HosptialRequestVerficationStatus;

  city?: string;

  $or?: {
    hospitalName?: {
      $regex: string;
      $options: string;
    };

    registrationNumber?: {
      $regex: string;
      $options: string;
    };
  }[];
}

export type CreateHospitalVerificationRepository = Omit<
  HospitalVerification,
  "createdAt" | "updatedAt"
>;

export type ResumbitHospitalVerficationRepository = Omit<HospitalVerification, "createdAt">;

export interface IHospitalVerificationRepository {
  create(data: CreateHospitalVerificationInput): Promise<HospitalVerification>;

  findPendingByUserId(userId: string): Promise<HospitalVerification | null>;
  findById(id: string): Promise<HospitalVerification | null>;

  findByIdStatus(id: string): Promise<{ adminRemarks: string; status: string }>;

  updateStatus(
    id: string,
    status: HospitalVerificationStatus,
    adminRemarks?: string
  ): Promise<void | HospitalVerification>;

  findAllPending(status?: string, search?: string): Promise<HospitalVerification[]>;

  resumbit(
    verficationId: string,
    input: Partial<ResumbitHospitalVerficationRepository>
  ): Promise<HospitalVerification | null>;

  update(id: string, data: Partial<HospitalVerification>): Promise<void>;

  findHosptialVerficationStatus(hositpalId: string): Promise<HospitalVerificationStatus | null>;

  countByStatus(status: HosptialRequestVerficationStatus): Promise<number>;
  countApprovedToday(): Promise<number>;

  getPaginated(
    filters: {
      search?: string;
      status?: HosptialRequestVerficationStatus;
      city?: string;
    },
    pagination: {
      skip: number;
      limit: number;
    }
  ): Promise<{
    data: HospitalVerificationLean[];
    total: number;
  }>;
}
