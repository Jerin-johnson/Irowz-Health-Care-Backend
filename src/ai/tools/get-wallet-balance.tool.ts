import { tool } from "@langchain/core/tools";
import { walletRepo } from "../../DI/repositers";

class GetWalletBalanceUseCase {
  async execute(userId: string): Promise<{ balance: number }> {
    const wallet = await walletRepo.findByUserId(userId);
    if (!wallet) throw new Error("something went wrong in the wallet repo");
    return wallet;
  }
}

export class WalletTool {
  constructor(private walletUseCase = new GetWalletBalanceUseCase()) {}

  build(userId: string) {
    return tool(
      async (): Promise<string> => {
        try {
          // Check wallet
          const wallet = await this.walletUseCase.execute(userId);

          return JSON.stringify({
            success: true,
            data: wallet,
            message: "Get wallet useCase",
          });
        } catch (err) {
          console.log(err);
          return JSON.stringify({ success: false, error: err.message });
        }
      },
      {
        name: "get_wallet_balance",
        description: "To check wallet money of the user and recent transaction all that",
      }
    );
  }
}
