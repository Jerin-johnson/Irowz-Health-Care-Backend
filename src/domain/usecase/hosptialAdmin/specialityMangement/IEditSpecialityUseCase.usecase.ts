export interface IEditSpecialityUseCase {
  execute(
    specialtyId: string,
    hospitalId: string,
    data: {
      name: string;
      description: string;
    }
  ): Promise<{
    message: string;
  }>;
}
