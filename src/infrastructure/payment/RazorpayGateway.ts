import Razorpay from "razorpay";
import crypto from "crypto";
import { IPaymentGateway } from "../../domain/payment/PaymentGateway";

export class RazorpayGateway implements IPaymentGateway {
  private client: Razorpay;

  constructor() {
    this.client = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async createOrder(params: { amount: number; receipt: string }) {
    const order = await this.client.orders.create({
      amount: params.amount,
      currency: "INR",
      receipt: params.receipt,
      payment_capture: true,
    });

    return {
      id: order.id,
      amount: Number(order.amount),
      currency: order.currency,
    };
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(payload)
      .digest("hex");

    return expectedSignature === signature;
  }
}
