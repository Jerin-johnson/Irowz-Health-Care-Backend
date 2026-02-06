import { Types } from "mongoose";
import { WalletDocument, WalletModel } from "../database/mongo/models/Wallet";

export class WalletRepository {
  async getOrCreate(userId: Types.ObjectId) {
    let wallet = await WalletModel.findOne({ userId });
    if (!wallet) {
      wallet = await WalletModel.create({
        userId,
        balance: 0,
        transactions: [],
      });
    }
    return wallet;
  }

  async credit(
    userId: Types.ObjectId,
    amount: number,
    reason: string,
    referenceId?: Types.ObjectId
  ) {
    const wallet = await this.getOrCreate(userId);

    wallet.balance += amount;
    wallet.transactions.push({
      amount,
      type: "CREDIT",
      reason,
      referenceId,
      createdAt: new Date(),
    });

    await wallet.save();
  }

  async debit(
    userId: Types.ObjectId,
    amount: number,
    reason: string,
    referenceId?: Types.ObjectId
  ) {
    const wallet = await this.getOrCreate(userId);

    if (wallet.balance < amount) {
      throw new Error("Insufficient wallet balance");
    }

    wallet.balance -= amount;
    wallet.transactions.push({
      amount,
      type: "DEBIT",
      reason,
      referenceId,
      createdAt: new Date(),
    });

    await wallet.save();
  }

  async findByUserId(userId: string): Promise<WalletDocument | null> {
    // return await WalletModel.findOne({ userId }).sort({ "transactions.createdAt": -1 }).lean();
    const limit = 30;
    const wallet = await WalletModel.findOne(
      { userId },
      { transactions: { $slice: -limit } }
    ).lean();

    if (!wallet) return null;

    wallet.transactions = wallet.transactions.reverse();
    return wallet;
  }
}
