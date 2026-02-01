import { Schema, model, Types } from "mongoose";

export interface WalletDocument {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;

  balance: number;

  transactions: {
    amount: number;
    type: "CREDIT" | "DEBIT";
    reason: string;
    referenceId?: Types.ObjectId;
    createdAt: Date;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema = new Schema<WalletDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
      index: true,
    },

    balance: {
      type: Number,
      default: 0,
    },

    transactions: [
      {
        amount: { type: Number, required: true },
        type: { type: String, enum: ["CREDIT", "DEBIT"], required: true },
        reason: { type: String, required: true },
        referenceId: Schema.Types.ObjectId,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const WalletModel = model<WalletDocument>("Wallet", WalletSchema);
