import {
  IExternalGateway,
  IPaymentProvider,
  PaymentInitResult,
} from "../../domain/payment/PaymentGateway";

export class RazorpayPaymentProvider implements IPaymentProvider {
  constructor(private readonly gateway: IExternalGateway) {}

  async initiate(input: {
    appointmentId: string;
    amount: number;
    patientId: string;
  }): Promise<PaymentInitResult> {
    const order = await this.gateway.createOrder({
      amount: input.amount * 100,
      receipt: input.appointmentId,
    });

    return {
      method: "RAZORPAY",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  }
}
