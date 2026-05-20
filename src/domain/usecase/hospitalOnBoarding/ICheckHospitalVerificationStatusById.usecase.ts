export interface ICheckHospitalVerificationStatusByIdUseCase {
  execute(id: string): Promise<{ adminRemarks: string; status: string }>;
}
