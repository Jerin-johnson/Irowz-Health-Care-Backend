export interface IGetVerificationRequestByIdUseCase {
  execute(hospitalVerificationId: string): Promise<any | null>;
}
