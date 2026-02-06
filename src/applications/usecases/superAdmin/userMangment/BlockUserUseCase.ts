import { IUserRepository } from "../../../../domain/repositories/IUser.repo";

export class BlockUserUserCase {
  constructor(private _UserRepo: IUserRepository) {}

  async execute(userId: string) {
    await this._UserRepo.BlockByUserId(userId, true);
  }
}
