import { IHospitalRepository } from "../../../../domain/repositories/IHospital.repo";
import { UserRepository } from "../../../../domain/repositories/IUser.repo";

export class BlockOrUnblockHospitalUseCase {
  constructor(
    private userRepo: UserRepository,
    private hospitalRepo: IHospitalRepository
  ) {}

  async execute(userId: string, status: string) {
    const finalStatus = status === "true" ? true : false;
    await this.userRepo.BlockByUserId(userId, finalStatus);
    await this.hospitalRepo.BlockBYUserId(userId, finalStatus);

    return { message: "Blocked the hospital successfully" };
  }
}
