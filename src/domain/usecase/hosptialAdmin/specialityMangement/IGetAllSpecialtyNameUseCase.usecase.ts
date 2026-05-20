import { Types } from "mongoose";

export interface IGetAllSpecialtyNameUseCase {
  execute(hospitalId: string): Promise<{ _id: string | Types.ObjectId; name: string }[]>;
}
