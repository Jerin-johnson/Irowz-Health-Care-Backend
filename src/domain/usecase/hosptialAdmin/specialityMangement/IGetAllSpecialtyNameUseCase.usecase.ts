export interface IGetAllSpecialtyNameUseCase {
  execute(hospitalId: string): Promise<any[]>;
}
