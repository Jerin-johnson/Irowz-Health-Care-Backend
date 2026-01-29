import { handlers } from ".";
import { getIO } from "../../../socket";
import { notificationRepo } from "../realtimeConsumer";

function formatDelay(delayMinutes: number): string {
  if (delayMinutes < 60) {
    return `${delayMinutes} minute${delayMinutes === 1 ? "" : "s"}`;
  }

  const hours = Math.floor(delayMinutes / 60);
  const minutes = delayMinutes % 60;

  if (minutes === 0) {
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }

  return `${hours} hour${hours === 1 ? "" : "s"} ${minutes} minute${minutes === 1 ? "" : "s"}`;
}

handlers["DOCTOR_DELAYED"] = async (event) => {
  const { doctorId, delayMinutes, reason, date, patientIds } = event.payload;

  console.log(patientIds);

  const io = getIO();

  const delayText = formatDelay(delayMinutes);

  const message = `Doctor is running ${delayText} late. ${reason ?? ""}`;

  console.log("is this message called", message);

  // Notify all affected patients
  for (const userId of patientIds) {
    const notification = await notificationRepo.create({
      userId: userId,
      type: event.type,
      title: "Doctor Delay",
      message,
      metadata: {
        doctorId,
        delayMinutes,
        reason,
        date,
      },
    });

    io.to(`user:${userId}`).emit("notification", notification);
  }

  // // Optional: notify doctor dashboard room
  // io.to(`doctor:${doctorId}:${date}`).emit("doctor_delay", {
  //   delayMinutes,
  //   reason,
  // });
};
