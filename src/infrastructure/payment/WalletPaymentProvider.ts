import { IPaymentProvider, PaymentInitResult } from "../../domain/payment/PaymentGateway";
import { WalletRepository } from "../repositories/WalletRepository";
import { Types } from "mongoose";

export class WalletPaymentProvider implements IPaymentProvider {
  constructor(private readonly walletRepo: WalletRepository) {}

  async initiate(input: {
    appointmentId: string;
    amount: number;
    patientId: string;
  }): Promise<PaymentInitResult> {
    await this.walletRepo.debit(
      new Types.ObjectId(input.patientId),
      input.amount,
      "Doctor appointment payment",
      new Types.ObjectId(input.appointmentId)
    );

    return {
      method: "WALLET",
      status: "PAID",
    };
  }
}
