export interface IDeleteSubscriptionUseCase {
  execute(id: string): Promise<void>;
}
