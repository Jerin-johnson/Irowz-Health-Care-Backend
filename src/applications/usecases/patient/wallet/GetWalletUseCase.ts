import { Wallet } from "../../../../domain/types/Wallet";
import { WalletRepository } from "../../../../infrastructure/repositories/WalletRepository";
import { toWalletDto } from "../../../dtos/patient/Wallet";

export class GetWalletUseCase {
  constructor(private _walletRepository: WalletRepository) {}

  async execute(userId: string) {
    const wallet = await this._walletRepository.findByUserId(userId);

    if (!wallet) {
      return {
        balance: 0,
        transactions: [],
      };
    }

    console.log("The wallet is", wallet);

    return toWalletDto(wallet as Wallet);
  }
}
