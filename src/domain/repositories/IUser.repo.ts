import { createUser, UserResponse, updateUser } from "../types/IUser.types";

export interface UserRepository {
  create(user: createUser): Promise<UserResponse | null>;
  findById(id: string): Promise<UserResponse | null>;
  findByEmail(email: string): Promise<UserResponse | null>;
  findAll(): Promise<UserResponse[] | []>;
  updateUser(user: updateUser): Promise<null | UserResponse>;
  markVerified(userId: string): Promise<void>;
}
