type ConsultationResponseAction = "ACCEPT" | "REJECT";

export interface IRespondConsultationUseCase {
  execute(
    consultationId: string,
    patientId: string,
    action: ConsultationResponseAction
  ): Promise<{
    message: string;
    status?: string;
  }>;
}
