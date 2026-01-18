import { IUserRepository } from "../../../domain/repositories/IUser.repo";
import crypto from "crypto";
import dotenv from "dotenv";
import { EmailQueueService } from "../../queue/EmailQueueService";
import { IForgetPasswordUseCase } from "../../../domain/usecase/auth/IForgetPasswordUseCase";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../DI/tsyringe/tokens";

dotenv.config();

@injectable()
export class ForgetPasswordUseCase implements IForgetPasswordUseCase {
  constructor(
    @inject(TOKENS.IUserRepository)
    private _UserRepo: IUserRepository,
    private _EmailQueueService: EmailQueueService
  ) {}

  async execute(email: string) {
    const user = await this._UserRepo.findByEmail(email);

    if (!user) throw new Error("If the email exists, a reset link has been sent");

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    await this._UserRepo.saveForgetPasswordToken(email, {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: new Date(Date.now() + 10 * 60 * 1000),
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await this._EmailQueueService.sendResetPasswordEmail(email, resetLink);
    return { message: "Password reset link sent" };
  }
}
