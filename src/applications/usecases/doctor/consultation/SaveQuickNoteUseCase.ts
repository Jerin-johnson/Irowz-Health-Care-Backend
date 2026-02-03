// import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { IMedicalRecordRepository } from "../../../../domain/repositories/IMedicalRecordRepository";
import { ISaveQuickNoteUseCase } from "../../../../domain/usecase/doctor/consultation/ISaveQuickNoteUseCase";

export class SaveQuickNoteUseCase implements ISaveQuickNoteUseCase {
  constructor(
    private readonly _MedicalRepo: IMedicalRecordRepository
    // private readonly _DoctorAppointmentRepo: IDoctorAppointmentRepository
  ) {}

  async execute(appointmentId: string, note: string) {
    await this._MedicalRepo.SaveQuickObservationByAppointmentId(appointmentId, note);
    return { message: "observation note saved successfully" };
  }
}
