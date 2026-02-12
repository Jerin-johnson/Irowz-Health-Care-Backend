export interface IMarkAsVerfiedUser {
  execute(userId: string): Promise<void>;
}
