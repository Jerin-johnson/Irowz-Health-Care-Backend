import { IUserRepository } from "../../../../domain/repositories/IUser.repo";
import { IBlockUserUserCase } from "../../../../domain/usecase/superAdmin/userMangment/IBlockUserUserCase";

export class BlockUserUserCase implements IBlockUserUserCase {
  constructor(private _UserRepo: IUserRepository) {}

  async execute(userId: string) {
    await this._UserRepo.BlockByUserId(userId, true);
  }
}
