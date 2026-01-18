import { createUser, UserResponse, updateUser } from "../types/IUser.types";

export interface IUserRepository {
  create(user: createUser): Promise<UserResponse | null>;
  findById(id: string): Promise<UserResponse | null>;
  findByEmail(email: string, phone?: number | string): Promise<UserResponse | null>;
  findAll(): Promise<UserResponse[] | []>;
  updateUser(user: updateUser): Promise<null | UserResponse>;
  markVerified(userId: string): Promise<void>;
  BlockByUserId(userId: string, status: boolean): Promise<void>;
  saveForgetPasswordToken(
    email: string,
    data: {
      resetPasswordToken: string;
      resetPasswordExpires: Date;
    }
  ): Promise<any>;

  findOneByResetPasswordToken(resetPasswordToken: string): Promise<UserResponse | null>;
}
