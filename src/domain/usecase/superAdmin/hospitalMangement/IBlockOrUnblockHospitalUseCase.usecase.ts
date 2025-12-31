export interface IBlockOrUnblockHospitalUseCase {
  execute(
    userId: string,
    status: string
  ): Promise<{
    message: string;
  }>;
}
