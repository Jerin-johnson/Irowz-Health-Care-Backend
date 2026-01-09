import { Server } from "socket.io";
import { redisSubscriber } from "./infrastructure/redis/redisPubSub";

export function setupSocket(httpServer: any) {
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    socket.on("join_room", ({ doctorId, date }) => {
      socket.join(`doctor:${doctorId}:${date}`);
    });

    socket.on("leave_room", ({ doctorId, date }) => {
      socket.leave(`doctor:${doctorId}:${date}`);
    });
  });

  redisSubscriber.subscribe("slot-events");

  redisSubscriber.on("message", (_channel, message) => {
    const event = JSON.parse(message);

    if (event.type === "SLOT_BOOKED") {
      const { doctorId, date, startTime } = event.payload;

      io.to(`doctor:${doctorId}:${date}`).emit("slot_booked", {
        startTime,
      });
    }
  });

  return io;
}
