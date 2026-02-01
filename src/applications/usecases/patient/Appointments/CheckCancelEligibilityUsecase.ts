import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { getDateOnly } from "../../../utils/getDayOnly";

export class CheckCancelEligibilityUseCase {
  constructor(private _appointmentRepo: IDoctorAppointmentRepository) {}

  async execute(appointmentId: string) {
    const appointment = await this._appointmentRepo.findById(appointmentId);

    if (!appointment) throw new Error("Appointment not found");

    if (["STARTED", "COMPLETED", "NO_SHOW"].includes(appointment.status)) {
      return { canCancel: false };
    }

    const bookingDate = getDateOnly(appointment.createdAt);
    const today = getDateOnly(new Date());

    const isRefundAllowed = bookingDate === today;

    return {
      canCancel: true,
      isRefundAllowed,
      refundAmount: isRefundAllowed ? appointment.totalAmount : 0,
    };
  }
}
