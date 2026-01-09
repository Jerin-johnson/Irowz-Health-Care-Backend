export interface IBaseRepository<TCreate, TUpdate, TResponse> {
  create(data: TCreate): Promise<TResponse | null>;

  findById(id: string): Promise<TResponse | null>;

  findAll(): Promise<TResponse[]>;

  update(data: TUpdate): Promise<TResponse | null>;

  delete?(id: string): Promise<void>;
}
