import {
  PaginatedResult,
  PaginationParams,
  UserStatusFilter,
} from "../../../repositories/IUser.repo";
import { UserResponse } from "../../../types/IUser.types";

export interface ISuperAdminGetAllUserUseCase {
  execute(
    pagination: PaginationParams,
    role?: string,
    status?: UserStatusFilter
    // search?: string
  ): Promise<PaginatedResult<UserResponse>>;
}
