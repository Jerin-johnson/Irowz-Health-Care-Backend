import {
  IUserRepository,
  PaginationParams,
  UserStatusFilter,
} from "../../../../domain/repositories/IUser.repo";

export class SuperAdminGetAllUserUseCase {
  constructor(private readonly _UserRepo: IUserRepository) {}

  async execute(
    pagination: PaginationParams,
    role?: string,
    status?: UserStatusFilter
    // search?: string
  ) {
    if (pagination.page < 1 || pagination.limit < 1) {
      throw new Error("Invalid pagination params");
    }

    return this._UserRepo.findAllUsers(pagination, role, status);
  }
}
