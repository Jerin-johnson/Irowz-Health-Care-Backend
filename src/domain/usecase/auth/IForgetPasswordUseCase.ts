export interface IForgetPasswordUseCase {
  execute(email: string): Promise<{ message: string }>;
}
