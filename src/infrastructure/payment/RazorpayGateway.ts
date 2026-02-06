import Razorpay from "razorpay";
import crypto from "crypto";
import { IPaymentGateway } from "../../domain/payment/PaymentGateway";
import dotenv from "dotenv";
dotenv.config();
export class RazorpayGateway implements IPaymentGateway {
  private client: Razorpay;

  constructor() {
    this.client = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async createOrder(params: { amount: number; receipt: string }) {
    try {
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
    } catch (error: any) {
      console.error("RAZORPAY ERROR:", error);
      throw new Error(error?.error?.description || error.message);
    }
  }

  verifyPaymentSignature(params: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): boolean {
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
      .digest("hex");

    return generatedSignature === params.razorpaySignature;
  }
}
