import { DoctorAppointmentDocument } from "../../infrastructure/database/mongo/models/DoctorAppointmentModel";

export type AppointmentStatus = "PENDING" | "BOOKED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";

export type VisitType = "OPD" | "ONLINE";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";

export type PaymentMethod = "RAZORPAY" | "WALLET";

//  keep only what you support

//  Snapshot of patient at booking time
export interface PatientSnapshot {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

//  Snapshot of address (mainly for in-person)
export interface AddressSnapshot {
  country: string;
  state: string;
  city: string;
  zip: string;
  street: string;
  apartment?: string;
}

export interface DoctorAppointment {
  id: string;

  // 🔹 Parties
  doctorId: string;
  patientId: string;
  hospitalId?: string;

  // 🔹 Slot (order time)
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  timezone: string;

  queuePriority: number;

  // 🔹 Visit
  visitType: VisitType;

  // 🔹 Checkout snapshot (IMPORTANT)
  patientSnapshot: PatientSnapshot;
  addressSnapshot?: AddressSnapshot;
  notes?: string;

  // 🔹 Payment snapshot (ORDER)
  consultationFee: number;
  discountAmount?: number;
  taxAmount?: number;
  totalAmount: number;

  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;

  refund?: {
    amount: number;
    refundedAt: Date;
    reason?: string;
  };

  // 🔹 Lifecycle
  status: AppointmentStatus;
  cancelledAt?: Date;
  cancelReason?: string;
  isRescheduleAppointment?: boolean;
  rescheduledFromAppointmentId?: string;
  rescheduledAt?: Date;

  startedAt?: Date;
  completedAt?: Date;

  // 🔹 Audit
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentFilterDTO {
  patientId: string;
  status?: string; // BOOKED | COMPLETED | etc
  date?: string; // YYYY-MM-DD
  page?: number;
  limit?: number;
}

export interface AppointmentListResult {
  data: DoctorAppointmentDocument[];
  total: number;
}
