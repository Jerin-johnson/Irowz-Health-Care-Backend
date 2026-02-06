import { IUserRepository } from "../../../../domain/repositories/IUser.repo";

export class MarkAsVerfiedUser {
  constructor(private _UserRepo: IUserRepository) {}

  async execute(userId: string) {
    await this._UserRepo.markVerified(userId);
  }
}
