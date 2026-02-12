import { IDoctorSlotCache } from "../../../../domain/cache/DoctorSlot.cache";
import { DomainEventPublisher } from "../../../../domain/events/event";
import { IExternalGateway } from "../../../../domain/payment/PaymentGateway";
import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { IHandleVerifyPayment } from "../../../../domain/usecase/patient/BookingSlots/IHandleVerifyPayment";

export class HandleVerifyPayment implements IHandleVerifyPayment {
  constructor(
    private readonly _paymentGateway: IExternalGateway,
    private readonly _appointmentRepo: IDoctorAppointmentRepository,
    private readonly _slotCache: IDoctorSlotCache,
    private readonly _eventPublisher: DomainEventPublisher
  ) {}

  async execute(params: {
    appointmentId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    razorpayOrderId: string;
  }) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, appointmentId } = params;

    const isValid = this._paymentGateway.verifySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValid) {
      throw new Error("Invalid Razorpay payment signature");
    }

    const appointment = await this._appointmentRepo.markPaid({
      appointmentId,
      transactionId: razorpayPaymentId,
    });

    if (this.isTodayOrTomorrow(new Date(appointment.date))) {
      console.log("this is called actually");
      await this._eventPublisher.publish({
        type: "QUEUE_UPDATED",
        payload: {
          doctorId: String(appointment.doctorId),
          date: String(appointment.date),
        },
      });
    }

    await this._slotCache.invalidate(appointment.doctorId, appointment.date);
  }

  private isTodayOrTomorrow(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    return target.getTime() === today.getTime() || target.getTime() === tomorrow.getTime();
  }
}
