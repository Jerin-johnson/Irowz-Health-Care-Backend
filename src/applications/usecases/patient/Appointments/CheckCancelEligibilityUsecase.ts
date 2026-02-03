import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { ICheckCancelEligibilityUseCase } from "../../../../domain/usecase/patient/Appointments/ICheckCancelEligibilityUseCase";
import { getDateOnly } from "../../../utils/getDayOnly";

export class CheckCancelEligibilityUseCase implements ICheckCancelEligibilityUseCase {
  constructor(private _appointmentRepo: IDoctorAppointmentRepository) {}

  async execute(appointmentId: string) {
    const appointment = await this._appointmentRepo.findById(appointmentId);

    if (!appointment) throw new Error("Appointment not found");

    if (["STARTED", "COMPLETED", "NO_SHOW"].includes(appointment.status)) {
      return { canCancel: false } as const;
    }

    const isAvailabilityAffected = appointment.availabilityAffected?.isAffected === true;

    if (isAvailabilityAffected) {
      return {
        canCancel: true,
        isRefundAllowed: true,
        refundAmount: appointment.totalAmount,
        reason: "DOCTOR_AVAILABILITY_CHANGED",
      } as const;
    }

    const bookingDate = getDateOnly(appointment.createdAt);
    const today = getDateOnly(new Date());

    const isRefundAllowed = bookingDate === today;

    return {
      canCancel: true,
      isRefundAllowed,
      refundAmount: isRefundAllowed ? appointment.totalAmount : 0,
    } as const;
  }
}
