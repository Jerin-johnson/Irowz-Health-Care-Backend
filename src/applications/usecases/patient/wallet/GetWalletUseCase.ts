import { IGetWalletUseCase } from "../../../../domain/usecase/patient/wallet/IGetWalletUseCase";
import { WalletRepository } from "../../../../infrastructure/repositories/WalletRepository";
import { toWalletDto, WalletDto, WalletSource } from "../../../dtos/patient/Wallet";

export class GetWalletUseCase implements IGetWalletUseCase {
  constructor(private _walletRepository: WalletRepository) {}

  async execute(userId: string): Promise<WalletDto> {
    const wallet = await this._walletRepository.findByUserId(userId);

    if (!wallet) {
      return {
        balance: 0,
        transactions: [],
      };
    }

    console.log("The wallet is", wallet);

    return toWalletDto(wallet as WalletSource);
  }
}
