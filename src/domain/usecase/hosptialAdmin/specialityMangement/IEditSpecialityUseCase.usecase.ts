export interface IEditSpecialityUseCase {
  execute(
    specialtyId: string,
    hospitalId: string,
    data: {
      name: string;
      description: string;
      symptoms: string[];
    }
  ): Promise<{
    message: string;
  }>;
}
