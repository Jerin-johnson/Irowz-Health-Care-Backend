export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  profileImage: string;
  isBlocked: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type updateUser = Partial<IUser>;
export type createUser = Omit<
  IUser,
  "_id" | "createdAt" | "updatedAt" | "updateAt" | "profileImage"
>;
export type UserResponse = Pick<
  IUser,
  | "_id"
  | "name"
  | "email"
  | "role"
  | "profileImage"
  | "isVerified"
  | "isBlocked"
  | "password"
>;

export type LoginUser = Pick<IUser, "email" | "password">;
