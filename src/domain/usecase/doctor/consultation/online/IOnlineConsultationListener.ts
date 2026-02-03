export interface IOnlineConsultationListener {
  handle(event: {
    payload: {
      appointmentId: string;
      doctorId: string;
      currentPatientId: string;
      visitType: string;
    };
    type: string;
  }): Promise<void>;
}
