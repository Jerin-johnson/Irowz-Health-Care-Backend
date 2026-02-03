import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { ICancelAppointmentUseCase } from "../../../../domain/usecase/patient/Appointments/ICancelAppointmentUseCase";
import { WalletRepository } from "../../../../infrastructure/repositories/WalletRepository";
import { getDateOnly } from "../../../utils/getDayOnly";

export class CancelAppointmentUseCase implements ICancelAppointmentUseCase {
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

    const isAvailabilityAffected = appointment.availabilityAffected?.isAffected === true;

    let isRefundAllowed = false;

    let refundAmount = 0;

    if (isAvailabilityAffected) {
      isRefundAllowed = true;
      refundAmount = appointment.totalAmount;

      appointment.cancelReason = "DOCTOR_AVAILABILITY_CHANGED";
      appointment.cancelledBy = "SYSTEM";
    } else {
      // Normal patient cancellation rules
      const bookingDate = getDateOnly(appointment.createdAt);
      const today = getDateOnly(new Date());

      isRefundAllowed = bookingDate === today;
      refundAmount = isRefundAllowed ? appointment.totalAmount : 0;

      appointment.cancelReason = "PATIENT_CANCELLED";
      appointment.cancelledBy = "PATIENT";
    }

    console.log(refundAmount);

    appointment.status = "CANCELLED";
    appointment.cancelledAt = new Date();

    appointment.refundEligibility = {
      isRefundAllowed,
      refundAmount: refundAmount,
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
        reason: appointment.cancelReason || "Cancelled on booking day",
      };
    }

    await this.appointmentRepo.save(appointment);

    return {
      success: true,
      refundIssued: isRefundAllowed,
    };
  }
}
