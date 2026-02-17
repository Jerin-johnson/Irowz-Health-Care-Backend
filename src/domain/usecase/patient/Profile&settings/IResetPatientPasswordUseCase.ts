export interface IResetPatientPasswordUseCase {
  execute(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }>;
}
