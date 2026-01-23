import { Server } from "socket.io";

let io: Server | null = null;

export const initSocket = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-doctor", (doctorId: string) => {
      console.log("👨‍⚕️ Doctor joined room:", doctorId);
      socket.join(`doctor:${doctorId}`);
    });

    socket.on("join-user", (userId: string) => {
      socket.join(`user:${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}
