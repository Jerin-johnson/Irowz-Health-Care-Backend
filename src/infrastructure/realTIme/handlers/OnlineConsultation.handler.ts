import { handlers } from ".";
import { getIO } from "../../../socket";

handlers["ONLINE_CONSULTATION_INITIATED"] = async (event) => {
  const { consultationId, appointmentId, patientId, doctorId } = event.payload;

  const io = getIO();

  // Patient gets incoming call
  io.to(`user:${patientId}`).emit("incoming-call", {
    consultationId,
    doctorId,
  });

  // Doctor also gets consultation context
  io.to(`doctor:${doctorId}`).emit("ONLINE_CONSULTATION_INITIATED", {
    consultationId,
    appointmentId,
  });

  console.log("The both is called");
};
