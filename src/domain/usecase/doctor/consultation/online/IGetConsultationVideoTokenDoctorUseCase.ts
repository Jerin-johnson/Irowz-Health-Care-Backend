export interface IGetConsultationVideoTokenDoctorUseCase {
  execute(
    consultationId: string,
    doctorId?: string
  ): Promise<{
    roomId: string;
    userId: string;
    userName: string;
  }>;
}
