import { ObjectId } from "mongoose";

export interface GetActiveDoctorOnlineConsultationUseCase {
  execute(doctorId: string): Promise<{
    status: "IDLE" | "CALLING" | "RINGING" | "IN_PROGRESS" | "REJECTED" | "ENDED"; // CALLING | IN_PROGRESS
    consultationId: string | ObjectId;
    appointmentId: string | ObjectId;
    patientId: string | ObjectId;
    roomId: string | ObjectId;
  }>;
}
