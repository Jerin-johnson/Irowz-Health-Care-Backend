import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { WalletRepository } from "../../../../infrastructure/repositories/WalletRepository";
import { getDateOnly } from "../../../utils/getDayOnly";

export class CancelAppointmentUseCase {
  constructor(
    private appointmentRepo: IDoctorAppointmentRepository,
    private walletRepo: WalletRepository
  ) {}

  async execute(appointmentId: string) {
    const appointment = await this.appointmentRepo.findByIdNoLean(appointmentId);

    if (!appointment) throw new Error("Appointment not found");

    if (["STARTED", "COMPLETED", "NO_SHOW"].includes(appointment.status)) {
      throw new Error("Appointment cannot be cancelled");
    }

    const bookingDate = getDateOnly(appointment.createdAt);
    const today = getDateOnly(new Date());

    const isRefundAllowed = bookingDate === today;

    appointment.status = "CANCELLED";
    appointment.cancelledAt = new Date();
    appointment.cancelledBy = "PATIENT";
    appointment.cancelReason = "PATIENT_CANCELLED";

    appointment.refundEligibility = {
      isRefundAllowed,
      refundAmount: isRefundAllowed ? appointment.totalAmount : 0,
      evaluatedAt: new Date(),
    };

    if (isRefundAllowed && appointment.paymentStatus === "PAID") {
      await this.walletRepo.credit(
        appointment.patientId,
        appointment.totalAmount,
        "Appointment cancellation refund",
        appointment._id
      );

      appointment.paymentStatus = "REFUNDED";
      appointment.refund = {
        amount: appointment.totalAmount,
        refundedAt: new Date(),
        reason: "Cancelled on booking day",
      };
    }

    await this.appointmentRepo.save(appointment);

    return {
      success: true,
      refundIssued: isRefundAllowed,
    };
  }
}
