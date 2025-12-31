export interface IGetDoctorProfileUseCase {
  execute(doctorId: string): Promise<any | null>;
}
