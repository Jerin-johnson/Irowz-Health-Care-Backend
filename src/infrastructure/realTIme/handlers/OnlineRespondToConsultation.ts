import { handlers } from ".";
import { getIO } from "../../../socket";

handlers["ONLINE_CONSULTATION_ACCEPTED"] = async (event) => {
  const { doctorId, patientId, consultationId, appointmentId } = event.payload;
  const io = getIO();

  // Doctor
  io.to(`doctor:${doctorId}`).emit("ONLINE_CONSULTATION_ACCEPTED", {
    consultationId,
    appointmentId,
  });

  // Patient
  io.to(`user:${patientId}`).emit("ONLINE_CONSULTATION_ACCEPTED", {
    consultationId,
    appointmentId,
  });

  console.log("Is the even called");
};

handlers["ONLINE_CONSULTATION_REJECTED"] = async (event) => {
  const { doctorId, consultationId } = event.payload;
  const io = getIO();

  io.to(`doctor:${doctorId}`).emit("ONLINE_CONSULTATION_REJECTED", {
    consultationId,
  });
};
