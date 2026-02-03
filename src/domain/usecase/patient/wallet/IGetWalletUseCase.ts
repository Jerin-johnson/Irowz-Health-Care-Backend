import { WalletDto } from "../../../../applications/dtos/patient/Wallet";

export interface IGetWalletUseCase {
  execute(userId: string): Promise<WalletDto>;
}
