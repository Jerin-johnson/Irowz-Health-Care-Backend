export interface IUnBlockUserUserCase {
  execute(userId: string): Promise<void>;
}
