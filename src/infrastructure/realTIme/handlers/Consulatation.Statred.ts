import { handlers } from ".";
import { getIO } from "../../../socket";
import { notificationRepo } from "../realtimeConsumer";

handlers["CONSULTATION_STARTED"] = async (event) => {
  const { currentPatientId, nextPatientIds } = event.payload;

  const io = getIO();

  // Current patient
  const currentNotification = await notificationRepo.create({
    userId: currentPatientId,
    type: event.type,
    title: "Consultation Started",
    message: "Doctor has started your consultation",
    metadata: event.payload,
  });

  io.to(`user:${currentPatientId}`).emit("notification", currentNotification);

  // Next patients
  for (const userId of nextPatientIds) {
    const notification = await notificationRepo.create({
      userId,
      type: event.type,
      title: "You are next",
      message: "Please be ready for your consultation",
      metadata: event.payload,
    });

    io.to(`user:${userId}`).emit("notification", notification);
  }
};
