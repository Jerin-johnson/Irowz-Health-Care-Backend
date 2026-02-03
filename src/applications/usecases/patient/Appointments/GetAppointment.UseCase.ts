import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { AppointmentFilterDTO } from "../../../../domain/types/DoctorAppointment";
import { IGetPatientAppointmentsUseCase } from "../../../../domain/usecase/patient/Appointments/IGetPatientAppointmentsUseCase";

export class GetPatientAppointmentsUseCase implements IGetPatientAppointmentsUseCase {
  constructor(private _appointmentRepo: IDoctorAppointmentRepository) {}

  async execute(filters: AppointmentFilterDTO) {
    if (!filters.patientId) {
      throw new Error("Patient ID is required");
    }

    return this._appointmentRepo.findAppointmentsByPatient(filters);
  }
}
