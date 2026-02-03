export interface AvailabilityChangedEvent {
  type: "DOCTOR_AVAILABILITY_CHANGED";
  payload: {
    doctorId: string;
    appointmentIds: string[];
    patientIds: string[];
    dateSet: string[]; // affected dates
  };
}
