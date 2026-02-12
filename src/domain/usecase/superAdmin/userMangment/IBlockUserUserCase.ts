export interface IBlockUserUserCase {
  execute(userId: string): Promise<void>;
}
