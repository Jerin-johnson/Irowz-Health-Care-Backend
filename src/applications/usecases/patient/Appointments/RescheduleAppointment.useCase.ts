import { IDoctorSlotLock } from "../../../../domain/lock/DoctorSlotLock";
import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { IRescheduleAppointmentUseCase } from "../../../../domain/usecase/patient/Appointments/IRescheduleAppointmentUseCase";
import { timeToMinutes } from "../../../../domain/utils/time.utils";
import { WalletRepository } from "../../../../infrastructure/repositories/WalletRepository";
import { getDateOnly } from "../../../utils/getDayOnly";

export class RescheduleAppointmentUseCase implements IRescheduleAppointmentUseCase {
  constructor(
    private _appointmentRepo: IDoctorAppointmentRepository,
    private _walletRepo: WalletRepository,
    private readonly _DoctorSlotLock: IDoctorSlotLock
  ) {}

  async execute(appointmentId: string, newDate: string, newStartTime: string, newEndTime: string) {
    const oldAppt = await this._appointmentRepo.findByIdNoLean(appointmentId);

    if (!oldAppt) throw new Error("Appointment not found");

    console.log(oldAppt);

    if (oldAppt.isRescheduleAppointment) {
      throw new Error("This appointment cannot be rescheduled again");
    }

    if (["STARTED", "COMPLETED", "NO_SHOW"].includes(oldAppt.status)) {
      throw new Error("Cannot reschedule appointment");
    }

    const isAvailabilityAffected = oldAppt.availabilityAffected?.isAffected === true;

    if (!isAvailabilityAffected) {
      const bookingDate = getDateOnly(oldAppt.createdAt);
      const today = getDateOnly(new Date());

      if (bookingDate !== today) {
        throw new Error("Reschedule allowed only on booking day");
      }
    }

    console.log(
      "is this working",
      String(oldAppt.doctorId),
      newDate,
      newStartTime,
      String(oldAppt.patientId)
    );

    const isLocked = await this._DoctorSlotLock.isLocked(
      String(oldAppt.doctorId),
      newDate,
      newStartTime,
      String(oldAppt.patientId)
    );

    if (!isLocked) {
      throw new Error("Slot lock expired or does not belong to this user");
    }

    const slotBlocked = await this._appointmentRepo.exists(
      String(oldAppt.doctorId),
      newDate,
      newStartTime
    );

    if (slotBlocked) {
      throw new Error("Slot already booked");
    }

    const queuePriority = timeToMinutes(newStartTime);

    // CREDIT wallet
    if (oldAppt.paymentStatus === "PAID") {
      await this._walletRepo.credit(
        oldAppt.patientId,
        oldAppt.totalAmount,
        "Refund for rescheduled appointment",
        oldAppt._id
      );
    }

    // CANCEL old appointment
    oldAppt.status = "CANCELLED";
    oldAppt.cancelledAt = new Date();
    oldAppt.cancelledBy = isAvailabilityAffected ? "SYSTEM" : "PATIENT";
    oldAppt.cancelReason = isAvailabilityAffected
      ? "DOCTOR_AVAILABILITY_CHANGED"
      : "PATIENT_RESCHEDULED";

    oldAppt.isRescheduleAppointment = true;

    oldAppt.refundEligibility = {
      isRefundAllowed: true,
      refundAmount: oldAppt.totalAmount,
      evaluatedAt: new Date(),
    };

    oldAppt.paymentStatus = "REFUNDED";
    oldAppt.refund = {
      amount: oldAppt.totalAmount,
      refundedAt: new Date(),
      reason: oldAppt.cancelReason,
    };

    //  CREATE new appointment
    const newAppt = await this._appointmentRepo.create({
      doctorId: String(oldAppt.doctorId),
      patientId: String(oldAppt.patientId),
      hospitalId: String(oldAppt.hospitalId),
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      timezone: oldAppt.timezone,
      visitType: oldAppt.visitType,
      patientSnapshot: oldAppt.patientSnapshot,
      addressSnapshot: oldAppt.addressSnapshot,
      consultationFee: oldAppt.consultationFee,
      discountAmount: oldAppt.discountAmount,
      totalAmount: oldAppt.totalAmount,
      paymentStatus: "PAID",
      status: "BOOKED",
      paymentMethod: oldAppt.paymentMethod,
      isRescheduleAppointment: true,
      rescheduledFromAppointmentId: String(oldAppt._id),
      rescheduledAt: new Date(),
      queuePriority,
    });

    //  DEBIT wallet for new appointment
    await this._walletRepo.debit(
      oldAppt.patientId,
      oldAppt.totalAmount,
      "Payment for rescheduled appointment",
      newAppt._id
    );

    oldAppt.rescheduledToAppointmentId = newAppt._id;
    await this._appointmentRepo.save(oldAppt);

    console.log("everything is okady");

    return {
      success: true,
      newAppointmentId: newAppt._id,
    };
  }
}
