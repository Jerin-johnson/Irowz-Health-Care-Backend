export interface IHandleVerifyPayment {
  execute(params: {
    appointmentId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    razorpayOrderId: string;
  }): Promise<void>;
}
