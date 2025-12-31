export interface IBlockOrUnblockDoctorUseCase {
  execute(data: { doctorId: string; status: string }): Promise<{
    message: string;
  }>;
}
