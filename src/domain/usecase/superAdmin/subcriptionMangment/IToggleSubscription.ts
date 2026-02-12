export interface IToggleSubscription {
  execute(planId: string, isActive: boolean): Promise<void>;
}
