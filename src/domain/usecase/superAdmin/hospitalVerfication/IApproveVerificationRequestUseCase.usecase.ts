export interface IApproveVerificationRequestUseCase {
  execute(
    hospitalId: string,
    adminRemarks?: string
  ): Promise<{
    message: string;
  }>;
}
