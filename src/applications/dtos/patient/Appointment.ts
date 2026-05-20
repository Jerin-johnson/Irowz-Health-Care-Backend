export interface AppointmentResponseDTO {
  _id: string;

  doctorId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    specialty?: string;
    avatar?: string;
  };

  patientId: string;

  date: string;
  startTime: string;
  endTime?: string;
  timezone: string;

  visitType: "OPD" | "ONLINE";

  patientSnapshot: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };

  consultationFee: number;
  discountAmount: number;
  taxAmount?: number;
  totalAmount: number;

  status: "PENDING" | "BOOKED" | "CANCELLED" | "COMPLETED" | "NO_SHOW" | "STARTED";

  cancelledAt?: Date;
  cancelReason?: string;
  isRescheduleAppointment: boolean;

  availabilityAffected?: {
    isAffected: boolean;
    reason: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

interface AppointmentMapperInput {
  _id: string | { toString(): string };

  doctorId?: {
    _id?: string | { toString(): string };

    userId?: {
      name?: string;
      profileImage?: string;
    };
  };

  patientId: string | { toString(): string };

  date: string | Date;

  startTime: string;

  endTime: string;

  timezone: string;

  visitType: string;

  patientSnapshot: unknown;

  isRescheduleAppointment?: boolean;

  consultationFee?: number;

  discountAmount?: number;

  taxAmount?: number;

  totalAmount?: number;

  status?: string;

  availabilityAffected?: {
    isAffected?: boolean;
    reason?: string;
  };

  cancelledAt?: Date | null;

  cancelReason?: string;

  createdAt?: Date;

  updatedAt?: Date;
}

export const mapAppointmentToResponse = (appointment: AppointmentMapperInput) => {
  const doctorUser = appointment.doctorId?.userId;

  const fullName = doctorUser?.name || "Doctor";
  const [firstName, ...rest] = fullName.split(" ");
  const lastName = rest.join(" ");

  return {
    _id: appointment._id.toString(),

    doctorId: {
      _id: appointment.doctorId?._id?.toString(),
      firstName,
      lastName,
      avatar: doctorUser?.profileImage,
    },

    patientId: appointment.patientId.toString(),

    date: appointment.date,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    timezone: appointment.timezone,

    visitType: appointment.visitType,

    patientSnapshot: appointment.patientSnapshot,
    isRescheduleAppointment: appointment.isRescheduleAppointment || false,

    consultationFee: appointment.consultationFee,
    discountAmount: appointment.discountAmount,
    taxAmount: appointment.taxAmount,
    totalAmount: appointment.totalAmount,

    status: appointment.status,

    availabilityAffected: {
      isAffected: appointment?.availabilityAffected?.isAffected || false,
      reason: appointment?.availabilityAffected?.reason || "",
    },
    cancelledAt: appointment.cancelledAt,
    cancelReason: appointment.cancelReason,

    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
  };
};
