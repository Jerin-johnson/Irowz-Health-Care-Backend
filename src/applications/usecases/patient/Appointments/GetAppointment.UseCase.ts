import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { AppointmentFilterDTO } from "../../../../domain/types/DoctorAppointment";

export class GetPatientAppointmentsUseCase {
  constructor(private _appointmentRepo: IDoctorAppointmentRepository) {}

  async execute(filters: AppointmentFilterDTO) {
    if (!filters.patientId) {
      throw new Error("Patient ID is required");
    }

    return this._appointmentRepo.findAppointmentsByPatient(filters);
  }
}
