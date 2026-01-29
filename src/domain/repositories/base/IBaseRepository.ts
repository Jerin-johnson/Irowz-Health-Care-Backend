import { Types } from "mongoose";

export interface IBaseRepository<TCreate, TUpdate, TResponse> {
  create(data: TCreate): Promise<TResponse | null>;
  findById(id: string | Types.ObjectId): Promise<TResponse | null>;
  findAll(): Promise<TResponse[]>;
  update(id: string, data: TUpdate): Promise<TResponse | null>;
  delete?(id: string): Promise<void>;
}
