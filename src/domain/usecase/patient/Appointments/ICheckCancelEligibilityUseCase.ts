export type CheckCancelEligibilityResult =
  | {
      canCancel: false;
    }
  | {
      canCancel: true;
      isRefundAllowed: boolean;
      refundAmount: number;
      reason?: "DOCTOR_AVAILABILITY_CHANGED";
    };

export interface ICheckCancelEligibilityUseCase {
  execute(appointmentId: string): Promise<CheckCancelEligibilityResult>;
}
