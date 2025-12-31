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

  // ---------------- DOCTOR CREDENTIALS ----------------
  async sendDoctorCredentials(
    email: string,
    fullName: string,
    password: string
  ): Promise<void> {
    console.log("sending email to doctor", email, fullName, password);
    await this.transporter.sendMail({
      from: `"My Healthcare SaaS" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Doctor Account Credentials",
      html: `
        <h3>Welcome Dr. ${fullName}</h3>
        <p>Your doctor account has been created.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Please log in and change your password immediately.</p>
      `,
    });
  }

  // ---------------- RESET PASSWORD ----------------
  async sendResetPassword(email: string, resetLink: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"My Healthcare SaaS" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });
  }
}
