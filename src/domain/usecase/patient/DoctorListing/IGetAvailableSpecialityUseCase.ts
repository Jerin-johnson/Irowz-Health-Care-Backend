import { Types } from "mongoose";

export interface IGetAvailableSpecialityUseCase {
  execute(): Promise<{ _id: string | Types.ObjectId; name: string }[]>;
}
