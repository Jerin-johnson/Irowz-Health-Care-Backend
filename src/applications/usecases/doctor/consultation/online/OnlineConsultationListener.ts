import { DomainEventPublisher } from "../../../../../domain/events/event";
import { IConsultationRepository } from "../../../../../domain/repositories/IConsultationRepository";

export class OnlineConsultationListener {
  constructor(
    private readonly consultationRepo: IConsultationRepository,
    private readonly eventPublisher: DomainEventPublisher
  ) {}

  async handle(event: {
    payload: {
      appointmentId: string;
      doctorId: string;
      currentPatientId: string;
      visitType: string;
    };
    type: string;
  }) {
    if (event.type !== "CONSULTATION_STARTED") return;

    const { appointmentId, doctorId, currentPatientId: patientId, visitType } = event.payload;

    // OPD ignored immediately
    if (visitType !== "ONLINE") return;

    // idempotent check
    let consultation = await this.consultationRepo.findByAppointmentId(String(appointmentId));

    if (!consultation) {
      consultation = await this.consultationRepo.create({
        appointmentId,
        doctorId,
        patientId,
        provider: "ZEGOCLOUD",
        roomId: `consult_${appointmentId}`,
        status: "CALLING",
      });
    }

    if (!consultation) throw new Error("something went wrong in online consulatiotion actually");

    await this.eventPublisher.publish({
      type: "ONLINE_CONSULTATION_INITIATED",
      payload: {
        consultationId: consultation._id,
        appointmentId,
        doctorId,
        patientId,
      },
    });
  }
}
