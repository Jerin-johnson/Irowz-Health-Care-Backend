import { IHospitalRepository } from "../../../../domain/repositories/IHospital.repo";
import { IUserRepository } from "../../../../domain/repositories/IUser.repo";
import { IBlockOrUnblockHospitalUseCase } from "../../../../domain/usecase/superAdmin/hospitalMangement/IBlockOrUnblockHospitalUseCase.usecase";

export class BlockOrUnblockHospitalUseCase implements IBlockOrUnblockHospitalUseCase {
  constructor(
    private userRepo: IUserRepository,
    private hospitalRepo: IHospitalRepository
  ) {}

  async execute(userId: string, status: string) {
    const finalStatus = status === "true" ? true : false;
    await this.userRepo.BlockByUserId(userId, finalStatus);
    await this.hospitalRepo.BlockBYUserId(userId, finalStatus);

    return { message: "Blocked the hospital successfully" };
  }
}
