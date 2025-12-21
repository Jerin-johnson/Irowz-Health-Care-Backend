import { IEmailService } from "../../domain/services/email.interface.service";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export class EmailNotificationService implements IEmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    console.log("email has sended", email, otp);
    await this.transporter.sendMail({
      from: `"My Healthcare SaaS" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your account",
      html: `
        <h3>Email Verification</h3>
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP expires in 5 minutes.</p>
      `,
    });
  }
}
