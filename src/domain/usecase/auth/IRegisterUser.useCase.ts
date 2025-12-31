import { createUser } from "../../types/IUser.types";

export interface IRegisterUserUseCase {
  execute(input: createUser): Promise<{
    message: string;
    userId: string;
    email: string;
    name: string;
  }>;
}
