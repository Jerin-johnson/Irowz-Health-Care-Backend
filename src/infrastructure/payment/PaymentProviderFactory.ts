import { IPaymentProvider } from "../../domain/payment/PaymentGateway";
import { PaymentMethod } from "../../domain/types/DoctorAppointment";

export class PaymentProviderFactory {
  constructor(
    private readonly razorpay: IPaymentProvider,
    private readonly wallet: IPaymentProvider
  ) {}

  get(method: PaymentMethod): IPaymentProvider {
    if (method === "RAZORPAY") return this.razorpay;
    if (method === "WALLET") return this.wallet;

    throw new Error("Unsupported payment method");
  }
}
