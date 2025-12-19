import { Schema, model } from "mongoose";

const OtpSchema = new Schema({
  userId: String,
  otpHash: String,
  expiresAt: Date,
});

export const OtpModel = model("Otp", OtpSchema);
