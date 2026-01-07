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
      visitType,
      patientSnapshot,
      addressSnapshot,
      notes,
    } = input;

    const isLocked = await this._DoctorSlotLock.isLocked(doctorId, date, startTime, patientId);

    if (!isLocked) {
      throw new Error("Slot lock expired or does not belong to this user");
    }

    const alreadyBooked = await this._DoctorAppoinmentRepo.exists(doctorId, date, startTime);

    if (alreadyBooked) {
      throw new Error("Slot already booked");
    }

    //check price
    const Doctor = await this._DoctorRepo.findById(doctorId);

    if (!Doctor) throw new Error("The selected Doctor is currently un avaible");

    const consultationFee = Doctor.consultationFee;
    // const discountAmount = 0;
    // const taxAmount = 0;

    const totalAmount = consultationFee; // - discountAmount + taxAmount;
    const appointment = await this._DoctorAppoinmentRepo.create({
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

      consultationFee,

      totalAmount,

      paymentStatus: "PENDING",
      paymentMethod: "RAZORPAY",

      status: "PENDING",
    });

    const razorpayOrder = await this._RazorpayService.createOrder({
      amount: totalAmount * 100,
      receipt: appointment.id,
    });

    // appointment.razorpayOrderId = razorpayOrder.id;

    // await appointment.save()

    await this._DoctorAppoinmentRepo.attachPaymentOrder(appointment.id, razorpayOrder.id);

    return {
      appointmentId: appointment.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    };
  }
}
