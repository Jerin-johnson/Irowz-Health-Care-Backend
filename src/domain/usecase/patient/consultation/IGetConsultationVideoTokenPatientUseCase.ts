export interface IGetConsultationVideoTokenPatientUseCase {
  execute(
    consultationId: string,
    userId?: string
  ): Promise<{
    // token,
    roomId: string;
    userId?: string;
    userName: string;
  }>;
}
