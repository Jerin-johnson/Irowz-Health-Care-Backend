import { handlers } from ".";
import { getIO } from "../../../socket";
import { notificationRepo } from "../realtimeConsumer";

handlers["MARK_NO_SHOW"] = async (event) => {
  const { patientId, newQueuePriority } = event.payload;

  const io = getIO();

  const notification = await notificationRepo.create({
    userId: patientId,
    type: event.type,
    title: "You were moved to the end of the queue",
    message: `You missed your turn. Your new queue position is ${newQueuePriority}. Please stay ready.`,
    metadata: {
      newQueuePriority,
    },
  });

  io.to(`user:${patientId}`).emit("notification", notification);
};
