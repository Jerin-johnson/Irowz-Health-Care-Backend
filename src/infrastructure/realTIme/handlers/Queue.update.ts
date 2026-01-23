import { handlers } from ".";
import { getIO } from "../../../socket";

handlers["QUEUE_UPDATED"] = async (event) => {
  const { doctorId, date } = event.payload;

  const io = getIO();

  io.to(`doctor:${doctorId}`).emit("queue-updated", {
    date,
  });

  console.log("The queue updated", doctorId);
};
