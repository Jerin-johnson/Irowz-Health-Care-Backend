import { CheckoutInput } from "../../../../applications/dtos/patient/CheckoutInput";

export interface ICheckoutResponse {
  readonly appointmentId: string;
  readonly razorpayOrderId: string;
  readonly amount: number;
  readonly currency: string;
}

export interface ICheckoutUseCase {
  execute(input: CheckoutInput): Promise<any | { appointmentId: string }>;
}
