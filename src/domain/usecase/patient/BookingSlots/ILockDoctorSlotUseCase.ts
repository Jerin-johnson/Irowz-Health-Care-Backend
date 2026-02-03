export interface ILockDoctorSlotUseCase {
  execute(params: {
    doctorId: string;
    date: string;
    startTime: string;
    userId: string;
  }): Promise<{ locked: boolean }>;
}
