import { IUserRepository } from "../../../domain/repositories/IUser.repo";
import { IPasswordService } from "../../../domain/services/password.interface.service";
import crypto from "crypto";
import { IResetPasswordUseCase } from "../../../domain/usecase/auth/IResetPasswordUseCase";
import { TOKENS } from "../../../DI/tsyringe/tokens";
import { inject, injectable } from "tsyringe";

@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    @inject(TOKENS.IUserRepository)
    private _UserRepo: IUserRepository,
    @inject(TOKENS.IPasswordService)
    private _PasswordService: IPasswordService
  ) {}

  async execute(token: string, newPassword: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await this._UserRepo.findOneByResetPasswordToken(hashedToken);
    if (!user) throw new Error("Invlaid request such user not found");

    const hashedPassword = await this._PasswordService.hash(newPassword);

    await this._UserRepo.updateUser({
      _id: user._id,
      password: hashedPassword,
      resetPasswordExpires: null,
      resetPasswordToken: null,
    });

    return { message: "password reseted successfully", role: user.role };
  }
}
