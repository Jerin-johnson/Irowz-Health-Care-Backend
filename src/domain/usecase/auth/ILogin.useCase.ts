import { LoginUser } from "../../types/IUser.types";

export interface ILoginUseCase {
  execute(
    input: LoginUser,
    allowedRoles: string[]
  ): Promise<{
    userId: string;
    name: string;
    email: string;
    role: string;
    accessToken: string;
    refreshToken: string;
    hospitalId?: string;
    doctorId?: string;
    forcePasswordReset: boolean;
  }>;
}
