import { Types } from "mongoose";
import { IBaseRepository } from "./base/IBaseRepository";
import { IPatientProfile } from "../types/IPatientProfile";

export interface IPatientProfileRepository extends IBaseRepository<
  Partial<IPatientProfile>,
  Partial<IPatientProfile>,
  Partial<IPatientProfile>
> {
  findByUserId(userId: Types.ObjectId | string): Promise<IPatientProfile | null>;

  updateByUserId(
    userId: Types.ObjectId | string,
    data: Partial<IPatientProfile>
  ): Promise<IPatientProfile | null>;
}
