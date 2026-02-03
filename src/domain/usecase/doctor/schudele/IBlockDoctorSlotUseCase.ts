export interface IBlockDoctorSlotUseCase {
  execute(doctorId: string, date: string, startTime: string, reason?: string): Promise<void>;
}
