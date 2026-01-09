import { IDoctorSlotCache } from "../../../../domain/cache/DoctorSlot.cache";
import { IPaymentGateway } from "../../../../domain/payment/PaymentGateway";
import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";

export class HandleVerifyPayment {
  constructor(
    private readonly _paymentGateway: IPaymentGateway,
    private readonly _appointmentRepo: IDoctorAppointmentRepository,
    private readonly _slotCache: IDoctorSlotCache
  ) {}

  async execute(params: {
    appointmentId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    razorpayOrderId: string;
  }) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, appointmentId } = params;

    const isValid = this._paymentGateway.verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      throw new Error("Invalid Razorpay payment signature");
    }

    const appointment = await this._appointmentRepo.markPaid({
      appointmentId,
      transactionId: razorpayPaymentId,
    });

    await this._slotCache.invalidate(appointment.doctorId, appointment.date);
  }
}
