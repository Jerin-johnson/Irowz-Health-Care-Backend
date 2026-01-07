import { IDoctorSlotCache } from "../../../../domain/cache/DoctorSlot.cache";
import { IPaymentGateway } from "../../../../domain/payment/PaymentGateway";
import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";

export class HandlePaymentWebhookUseCase {
  constructor(
    private readonly paymentGateway: IPaymentGateway,
    private readonly appointmentRepo: IDoctorAppointmentRepository,
    private readonly slotCache: IDoctorSlotCache
  ) {}

  async execute(params: { rawBody: string; signature: string }) {
    const { rawBody, signature } = params;

    const isValid = this.paymentGateway.verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      throw new Error("Invalid Razorpay webhook signature");
    }

    const event = JSON.parse(rawBody);

    if (event.event !== "payment.captured") {
      console.log("something went wrong");
      return;
    }

    const razorpayOrderId = event.payload.payment.entity.order_id;

    const transactionId = event.payload.payment.entity.id;

    const appointment = await this.appointmentRepo.markPaid({
      razorpayOrderId,
      transactionId,
    });

    await this.slotCache.invalidate(appointment.doctorId, appointment.date);
  }
}
