export interface IResetDoctorPasswordUseCase {
  execute(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{
    message: string;
  }>;
}
