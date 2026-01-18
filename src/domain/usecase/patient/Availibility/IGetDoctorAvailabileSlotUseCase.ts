import { Slot } from "../../../../domain/types/Slot";

export interface IGetDoctorAvailableSlotUseCase {
  execute(doctorId: string, date: string): Promise<Slot[]>;
}
