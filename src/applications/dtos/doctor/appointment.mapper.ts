export interface AppointmentDto {
  id: string;
  doctorId: string;
  patientId: string;

  date: string; // "2026-01-21" (ISO local date)
  startTime: string; // "14:30" (HH:mm)
  timezone: string; // "Asia/Kolkata"
  visitType: "OPD" | "ONLINE" | "HOME_VISIT"; // adjust as per your enums

  patient: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };

  address: {
    country: string;
    state: string;
    city: string;
    zip: string;
    street: string;
  };

  consultationFee: number;
  discountAmount: number;
  totalAmount: number;

  paymentStatus: "PAID" | "PENDING" | "FAILED"; // etc.
  paymentMethod: "RAZORPAY" | "CASH" | "CARD"; // etc.

  queuePriority: number;
  isLate: boolean;
  status: "BOOKED" | "COMPLETED" | "CANCELLED"; // etc.

  isRescheduleAppointment: boolean;

  createdAt: string;
  updatedAt: string;
}

export const toAppointmentDto = (doc: any): AppointmentDto => ({
  id: doc._id.toString(),
  doctorId: doc.doctorId.toString(),
  patientId: doc.patientId.toString(),

  date: doc.date,
  startTime: doc.startTime,
  timezone: doc.timezone,
  visitType: doc.visitType as AppointmentDto["visitType"],

  patient: {
    firstName: doc.patientSnapshot.firstName,
    lastName: doc.patientSnapshot.lastName,
    phone: doc.patientSnapshot.phone,
    email: doc.patientSnapshot.email,
  },

  address: {
    country: doc.addressSnapshot?.country,
    state: doc.addressSnapshot?.state,
    city: doc.addressSnapshot?.city,
    zip: doc.addressSnapshot?.zip,
    street: doc.addressSnapshot?.street,
  },

  consultationFee: doc.consultationFee,
  discountAmount: doc.discountAmount,
  totalAmount: doc.totalAmount,

  paymentStatus: doc.paymentStatus as AppointmentDto["paymentStatus"],
  paymentMethod: doc.paymentMethod as AppointmentDto["paymentMethod"],

  queuePriority: doc.queuePriority,
  isLate: doc.isLate,
  status: doc.status as AppointmentDto["status"],
  isRescheduleAppointment: doc?.isRescheduleAppointment || false,

  createdAt: doc.createdAt.toISOString(),
  updatedAt: doc.updatedAt.toISOString(),
});
