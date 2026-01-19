import { IDoctorSlotLock } from "../../../../domain/lock/DoctorSlotLock";
import { IPaymentGateway } from "../../../../domain/payment/PaymentGateway";
import { IDoctorRepository } from "../../../../domain/repositories/IDoctor.repo";
import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { CheckoutInput } from "../../../dtos/patient/CheckoutInput";

export class CheckoutUseCase {
  constructor(
    private readonly _DoctorSlotLock: IDoctorSlotLock,
    private readonly _DoctorAppoinmentRepo: IDoctorAppointmentRepository,
    private readonly _RazorpayService: IPaymentGateway,
    private readonly _DoctorRepo: IDoctorRepository
  ) {}

  async execute(input: CheckoutInput) {
    const {
      doctorId,
      patientId,
      date,
      startTime,
      endTime,
      visitType = "OPD",
      patientSnapshot,
      addressSnapshot,
      notes,
    } = input;

    const isLocked = await this._DoctorSlotLock.isLocked(doctorId, date, startTime, patientId);

    if (!isLocked) {
      throw new Error("Slot lock expired or does not belong to this user");
    }

    const slotBlocked = await this._DoctorAppoinmentRepo.exists(doctorId, date, startTime);

    if (slotBlocked) {
      throw new Error("Slot already booked");
    }

    let appointment = await this._DoctorAppoinmentRepo.findPendingByUser(
      doctorId,
      patientId,
      date,
      startTime
    );

    if (!appointment) {
      const Doctor = await this._DoctorRepo.findById(doctorId);
      if (!Doctor) throw new Error("Doctor unavailable");

      appointment = await this._DoctorAppoinmentRepo.create({
        doctorId,
        patientId,
        date,
        startTime,
        endTime,
        timezone: "Asia/Kolkata",
        visitType,
        patientSnapshot,
        addressSnapshot,
        notes,
        consultationFee: Doctor.consultationFee,
        totalAmount: Doctor.consultationFee,
        paymentStatus: "PENDING",
        paymentMethod: "RAZORPAY",
        status: "PENDING",
      });
    }

    const razorpayOrder = await this._RazorpayService.createOrder({
      amount: appointment.totalAmount * 100,
      receipt: appointment.id,
    });

    await this._DoctorAppoinmentRepo.attachPaymentOrder(appointment.id, razorpayOrder.id);

    return {
      appointmentId: appointment._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    };
  }
}
