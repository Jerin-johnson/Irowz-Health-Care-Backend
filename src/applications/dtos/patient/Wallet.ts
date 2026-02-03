import { Types } from "mongoose";

export interface TransactionDto {
  _id?: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  reason: string;
  referenceId?: string;
  createdAt: Date;
}

export interface WalletDto {
  balance: number;
  transactions: TransactionDto[];
}

export interface WalletTransactionSource {
  _id?: Types.ObjectId;
  amount: number;
  type: "CREDIT" | "DEBIT";
  reason: string;
  referenceId?: Types.ObjectId;
  createdAt: Date;
}

export interface WalletSource {
  balance: number;
  transactions: WalletTransactionSource[];
}

export const toWalletDto = (wallet: WalletSource): WalletDto => {
  return {
    balance: wallet.balance,
    transactions: wallet.transactions.map((t) => ({
      _id: t._id?.toString(),
      amount: t.amount,
      type: t.type,
      reason: t.reason,
      referenceId: t.referenceId?.toString(),
      createdAt: t.createdAt,
    })),
  };
};
