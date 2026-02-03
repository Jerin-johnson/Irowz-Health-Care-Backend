import { DoctorAppointmentDocument } from "../../../../infrastructure/database/mongo/models/DoctorAppointmentModel";

import { IPatientProfile } from "../../../types/IPatientProfile";

export interface GetPatientOverviewResult {
  patientProfile: IPatientProfile | null;
  appoinment: DoctorAppointmentDocument;
  dob?: Date;
  gender?: string;
}

export interface IGetPatientOverviewUseCase {
  execute(appointmentId: string): Promise<GetPatientOverviewResult>;
}
