export interface ICheckRescheduleEligibilityResponse {
  canReschedule: boolean;
  refundAllowed?: boolean;
  refundAmount?: number;
  reason?: string;
}

export interface ICheckRescheduleEligibilityUseCase {
  execute(appointmentId: string): Promise<ICheckRescheduleEligibilityResponse>;
}
