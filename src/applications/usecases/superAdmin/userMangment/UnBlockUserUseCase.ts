import { IUserRepository } from "../../../../domain/repositories/IUser.repo";
import { IUnBlockUserUserCase } from "../../../../domain/usecase/superAdmin/userMangment/IUnBlockUserUserCase";

export class UnBlockUserUserCase implements IUnBlockUserUserCase {
  constructor(private _UserRepo: IUserRepository) {}

  async execute(userId: string) {
    await this._UserRepo.BlockByUserId(userId, false);
  }
}
