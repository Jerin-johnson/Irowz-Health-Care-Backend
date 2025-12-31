import { IUserRepository } from "../../../../domain/repositories/IUser.repo";
import { IPasswordService } from "../../../../domain/services/password.interface.service";
import { IResetDoctorPasswordUseCase } from "../../../../domain/usecase/doctor/doctorProfile/IResetDoctorPasswordUseCase.usecase";

export class ResetDoctorPasswordUseCase implements IResetDoctorPasswordUseCase {
  constructor(
    private readonly _UserRepo: IUserRepository,
    private readonly _PasswordService: IPasswordService
  ) {}

  async execute(userId: string, currentPassword: string, newPassword: string) {
    const user = await this._UserRepo.findById(userId);
    console.log("the user is", user);

    if (!user) throw new Error("Doctor doesn't find");

    const validPassword = await this._PasswordService.compare(
      currentPassword,
      user.password
    );

    if (!validPassword) throw new Error("Invalid password");

    const hashedPassword = await this._PasswordService.hash(newPassword);

    await this._UserRepo.updateUser({
      _id: userId,
      forcePasswordReset: false,
      password: hashedPassword,
    });

    return { message: "Password Updated successfully" };
  }
}
