export interface ICheckHospitalVerificationStatusByIdUseCase {
  execute(id: string): Promise<any>;
}
