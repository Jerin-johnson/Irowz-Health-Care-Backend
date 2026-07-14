import { DomainEventPublisher } from "../../domain/events/event";
import { redisPublisher } from "../redis/redisPubSub";

export class RealtimePublisher implements DomainEventPublisher {
  async publish(event: { type: string; payload: unknown }) {
    await redisPublisher.publish("realtime-events", JSON.stringify(event));
  }
}
