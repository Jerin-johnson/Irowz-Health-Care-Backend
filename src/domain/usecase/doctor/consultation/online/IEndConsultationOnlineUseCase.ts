export interface IEndConsultationOnlineUseCase {
  execute(consultationId: string): Promise<void>;
}
