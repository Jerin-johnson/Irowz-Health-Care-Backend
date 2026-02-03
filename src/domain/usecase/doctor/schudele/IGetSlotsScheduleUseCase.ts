import { DoctorSchudleSlot } from "../../../../applications/usecases/doctor/schedule/GetSlots.schedule.UseCase";

export interface IGetSlotsScheduleUseCase {
  execute(doctorId: string, date: string): Promise<DoctorSchudleSlot[]>;
}
