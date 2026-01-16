export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender?: string;
  password: string;
  role: string;
  profileImage: string;
  forcePasswordReset?: boolean;
  isBlocked: boolean;
  dob: Date;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type updateUser = Partial<IUser>;
export type createUser = Omit<
  IUser,
  "_id" | "createdAt" | "updatedAt" | "updateAt" | "profileImage" | "dob"
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
  | "forcePasswordReset"
  | "dob"
  | "gender"
  | "phone"
>;

export type LoginUser = Pick<IUser, "email" | "password">;
