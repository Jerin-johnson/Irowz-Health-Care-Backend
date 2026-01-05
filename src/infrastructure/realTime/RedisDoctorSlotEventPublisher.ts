import { DoctorSlotEventPublisher } from "../../domain/realTime/DoctorSlotEventPublisher";
import { redisPublisher } from "../redis/redisPubSub";

export class RedisSlotEventPublisher implements DoctorSlotEventPublisher {
  async slotBooked(event: { doctorId: string; date: string; startTime: string }) {
    await redisPublisher.publish(
      "slot-events",
      JSON.stringify({
        type: "SLOT_BOOKED",
        payload: event,
      })
    );
  }
}
