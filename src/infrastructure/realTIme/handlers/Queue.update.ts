import { handlers } from ".";
import { getIO } from "../../../socket";

handlers["QUEUE_UPDATED"] = async (event) => {
  const { doctorId, date, patientIds } = event.payload;

  console.log("The result is", patientIds);
  const io = getIO();

  io.to(`doctor:${doctorId}`).emit("queue-updated", {
    date,
  });

  if (patientIds) {
    console.log("Notifying all the patients");
    for (const userId of patientIds) {
      io.to(`user:${userId}`).emit("queue-updated", { date });
    }
  }

  console.log("The queue updated", doctorId);
};
