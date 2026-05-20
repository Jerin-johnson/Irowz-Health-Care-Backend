export interface DomainEvent {
  type: string;
  occurredAt: Date;
  payload: object;
}

export const ConsultationEvents = {
  CONSULTATION_STARTED: "CONSULTATION_STARTED",
  CONSULTATION_COMPLETED: "CONSULTATION_COMPLETED",
};

export interface DomainEventPublisher {
  publish(event: { type: string; payload: object }): Promise<void>;
}
