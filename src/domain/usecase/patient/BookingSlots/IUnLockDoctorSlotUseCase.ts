export interface IUnLockDoctorSlotUseCase {
  execute(params: {
    doctorId: string;
    date: string;
    startTime: string;
  }): Promise<{ unlocked: boolean }>;
}
