export type AppointmentStatus = "PENDING" | "BOOKED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";

export type VisitType = "IN_PERSON" | "ONLINE";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";

export type PaymentMethod = "CARD" | "UPI" | "NET_BANKING" | "WALLET" | "CASH";

export interface DoctorAppointment {
  id: string;

  // 🔹 Parties
  doctorId: string;
  patientId: string;
  hospitalId?: string;

  // 🔹 Slot (booked)
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  timezone: string;

  // 🔹 Medical
  visitType: VisitType;

  // 🔹 Order / Payment Snapshot
  consultationFee: number; // base price
  discountAmount: number; // coupons/offers
  taxAmount?: number;
  totalAmount: number; // final paid

  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
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

  startedAt?: Date;
  completedAt?: Date;

  // 🔹 Audit
  createdAt: Date;
  updatedAt: Date;
}
