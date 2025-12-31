export interface IRejectVerificationRequestUseCase {
  execute(
    hospitalId: string,
    adminRemarks?: string
  ): Promise<{
    message: string;
  }>;
}
