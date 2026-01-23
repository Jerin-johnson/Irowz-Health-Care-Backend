import { redisSubscriber } from "../redis/redisPubSub";
import { NotificationRepository } from "../repositories/notification/NotificationRepository";
import { handlers } from "./handlers";
import "./handlers/registerHandlers";

export const notificationRepo = new NotificationRepository();

export function setupRealtimeConsumer() {
  redisSubscriber.subscribe("realtime-events");

  redisSubscriber.on("message", async (_channel, message) => {
    const event = JSON.parse(message);

    const handler = handlers[event.type];

    if (!handler) {
      console.warn("No handler for event:", event.type);
      return;
    }

    await handler(event);
  });
}
