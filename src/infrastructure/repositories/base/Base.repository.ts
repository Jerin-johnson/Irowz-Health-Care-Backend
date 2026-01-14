import { IBaseRepository } from "../../../domain/repositories/base/IBaseRepository";

export class BaseRepository<TCreate, TUpdate, TResponse> implements IBaseRepository<
  TCreate,
  TUpdate,
  TResponse
> {
  constructor(protected readonly model: any) {}

  async create(data: TCreate): Promise<TResponse | null> {
    return this.model.create(data);
  }

  async findById(id: string): Promise<TResponse | null> {
    return this.model.findById(id);
  }

  async findAll(): Promise<TResponse[]> {
    return this.model.find();
  }

  async update(id: string, data: TUpdate): Promise<TResponse | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }
}
