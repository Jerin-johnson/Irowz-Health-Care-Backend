import Razorpay from "razorpay";
import crypto from "crypto";
import { IExternalGateway } from "../../domain/payment/PaymentGateway";
import dotenv from "dotenv";
dotenv.config();

interface RazorpayError {
  error?: {
    description?: string;
  };

  message?: string;
}
export class RazorpayGateway implements IExternalGateway {
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
    } catch (error: unknown) {
      console.error("RAZORPAY ERROR:", error);
      const razorpayError = error as RazorpayError;

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error(
        razorpayError.error?.description || razorpayError.message || "Payment gateway error"
      );
    }
  }

  verifySignature(input: { orderId: string; paymentId: string; signature: string }): boolean {
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${input.orderId}|${input.paymentId}`)
      .digest("hex");

    return generatedSignature === input.signature;
  }

  // verifySignature({ orderId, paymentId, signature }): boolean {
  //   const generated = crypto
  //     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
  //     .update(`${orderId}|${paymentId}`)
  //     .digest("hex");

  //   return generated === signature;
  // }

  // verifyPaymentSignature(input: {
  //   orderId: string;
  //   paymentId: string;
  //   signature: string;
  // }): boolean {
  //   const generatedSignature = crypto
  //     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
  //     .update(`${input.orderId}|${input.paymentId}`)
  //     .digest("hex");

  //   return generatedSignature === input.signature;
  // }
}
