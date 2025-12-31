export interface IBlockOrUnblockSpecialtyUseCase {
  execute(data: { id: string; status: string }): Promise<{
    message: string;
  }>;
}
