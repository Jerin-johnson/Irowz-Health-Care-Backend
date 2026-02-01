export interface Wallet {
  balance: number;
  transactions: {
    id?: string;
    amount: number;
    type: "CREDIT" | "DEBIT";
    reason: string;
    referenceId?: string;
    createdAt: Date;
  }[];
}
