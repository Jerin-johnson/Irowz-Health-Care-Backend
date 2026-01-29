import { handlers } from ".";
import { OnlineConsultationListener } from "../../../applications/usecases/doctor/consultation/online/OnlineConsultationListener";
import { realtimePublisher } from "../../../DI/realtime";
import { consultationRepo } from "../../../DI/repositers";
import { getIO } from "../../../socket";
import { notificationRepo } from "../realtimeConsumer";

const onlineListener = new OnlineConsultationListener(consultationRepo, realtimePublisher);

handlers["CONSULTATION_STARTED"] = async (event) => {
  const { currentPatientId, nextPatientIds } = event.payload;

  const io = getIO();

  // Current patient
  const currentNotification = await notificationRepo.create({
    userId: currentPatientId as string,
    type: event.type,
    title: "Consultation Started",
    message: "Doctor has started your consultation",
    metadata: "Here we store the information of the next patient actually",
  });

  io.to(`user:${currentPatientId}`).emit("notification", currentNotification);

  // Next patients
  for (const userId of nextPatientIds) {
    const notification = await notificationRepo.create({
      userId: userId.patientId,
      type: event.type,
      title: "You will be called next",
      message: "Please be ready for your consultation",
      metadata: "here we store patient id of the next patient",
    });

    io.to(`user:${userId.patientId}`).emit("notification", notification);
  }

  //online

  await onlineListener.handle(event);
};
