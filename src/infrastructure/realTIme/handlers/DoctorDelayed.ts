import { handlers } from ".";
import { getIO } from "../../../socket";
import { notificationRepo } from "../realtimeConsumer";

handlers["DOCTOR_DELAYED"] = async (event) => {
  const { doctorId, delayMinutes, reason, date, patientIds } = event.payload;

  const io = getIO();

  const message = `Doctor is running ${delayMinutes} minutes late. ${reason ?? ""}`;

  // Notify all affected patients
  for (const userId of patientIds) {
    const notification = await notificationRepo.create({
      userId,
      type: event.type,
      title: "Doctor Delay",
      message,
      metadata: {
        doctorId,
        delayMinutes,
        date,
      },
    });

    io.to(`user:${userId}`).emit("notification", notification);
  }

  // Optional: notify doctor dashboard room
  io.to(`doctor:${doctorId}:${date}`).emit("doctor_delay", {
    delayMinutes,
    reason,
  });
};
