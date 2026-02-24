import { IDoctorSlotLock } from "../../../../domain/lock/DoctorSlotLock";
import { IDoctorRepository } from "../../../../domain/repositories/IDoctor.repo";
import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { ICheckoutUseCase } from "../../../../domain/usecase/patient/BookingSlots/ICheckoutUseCase";
import { timeToMinutes } from "../../../../domain/utils/time.utils";
import { PaymentProviderFactory } from "../../../../infrastructure/payment/PaymentProviderFactory";
import { CheckoutInput } from "../../../dtos/patient/CheckoutInput";

export class CheckoutUseCase implements ICheckoutUseCase {
  constructor(
    private readonly _DoctorSlotLock: IDoctorSlotLock,
    private readonly _DoctorAppoinmentRepo: IDoctorAppointmentRepository,
    private readonly _PaymentFactory: PaymentProviderFactory,
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
      paymentMethod,
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

    const queuePriority = timeToMinutes(startTime);

    if (!appointment) {
      const Doctor = await this._DoctorRepo.findById(doctorId);
      if (!Doctor) throw new Error("Doctor unavailable");

      console.log("The Doctor is", Doctor);

      appointment = await this._DoctorAppoinmentRepo.create({
        doctorId,
        hospitalId: String(Doctor.hospitalId._id),
        patientId,
        date,
        startTime,
        endTime,
        timezone: "Asia/Kolkata",
        visitType,
        patientSnapshot,
        addressSnapshot,
        notes,
        queuePriority,
        consultationFee: Doctor.consultationFee,
        totalAmount: Doctor.consultationFee,
        paymentStatus: "PENDING",
        paymentMethod: paymentMethod,
        status: "PENDING",
      });
    }

    console.log(appointment);

    const provider = this._PaymentFactory.get(paymentMethod);

    const payment = await provider.initiate({
      appointmentId: appointment.id,
      amount: appointment.totalAmount,
      patientId: input.patientId,
    });

    if (payment.method === "WALLET") {
      await this._DoctorAppoinmentRepo.markPaid({
        appointmentId: appointment.id,
        transactionId: "WALLET",
      });
    }

    if (payment.method === "RAZORPAY") {
      await this._DoctorAppoinmentRepo.attachPaymentOrder(appointment.id, payment.orderId);

      return {
        appointmentId: appointment._id,
        razorpayOrderId: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
      };
    }

    // const razorpayOrder = await this._RazorpayService.createOrder({
    //   amount: appointment.totalAmount * 100,
    //   receipt: appointment.id,
    // });

    // await this._DoctorAppoinmentRepo.attachPaymentOrder(appointment.id, razorpayOrder.id);

    return {
      appointmentId: appointment._id,
    };
  }
}
