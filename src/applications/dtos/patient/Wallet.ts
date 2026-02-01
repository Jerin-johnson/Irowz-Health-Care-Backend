interface Transaction {
  _id?: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  reason: string;
  referenceId?: string;
  createdAt: Date;
}

export interface Wallet {
  balance: number;
  transactions: Transaction[];
}

export const toWalletDto = (wallet: Wallet) => {
  return {
    balance: wallet.balance,
    transactions: wallet.transactions.map((t: any) => ({
      _id: t._id,
      amount: t.amount,
      type: t.type,
      reason: t.reason,
      referenceId: t.referenceId,
      createdAt: t.createdAt,
    })),
  };
};
