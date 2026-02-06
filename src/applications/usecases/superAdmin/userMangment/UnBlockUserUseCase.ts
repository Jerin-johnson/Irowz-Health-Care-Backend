import { IUserRepository } from "../../../../domain/repositories/IUser.repo";

export class UnBlockUserUserCase {
  constructor(private _UserRepo: IUserRepository) {}

  async execute(userId: string) {
    await this._UserRepo.BlockByUserId(userId, false);
  }
}
