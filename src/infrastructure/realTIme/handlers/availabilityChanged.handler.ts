import { handlers } from ".";
import { getIO } from "../../../socket";

handlers["DOCTOR_AVAILABILITY_CHANGED"] = async (event: {
  payload: {
    doctorId: string;
    patientIds: string[];
    dateSet: string[];
  };
}): Promise<void> => {
  const { doctorId, patientIds, dateSet } = event.payload;
  const io = getIO();

  // Notify doctor
  io.to(`doctor:${doctorId}`).emit("availability-changed", {
    dates: dateSet,
  });

  // Notify patients
  for (const patientId of patientIds) {
    io.to(`user:${patientId}`).emit("notification", {
      dates: dateSet,
    });
  }
};
