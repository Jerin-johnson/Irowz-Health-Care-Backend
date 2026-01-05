import { DoctorSlotCache } from "../../../../domain/cache/DoctorSlot.cache";
import { Slot } from "../../../../domain/types/Slot";
import { ComputeDoctorSlotsUseCase } from "../../doctor/slot/doctorSlot/ComputeDoctorSlotsUseCase";

export class GetDoctorSlotsUseCase {
  constructor(
    private readonly cache: DoctorSlotCache,
    private readonly computeSlots: ComputeDoctorSlotsUseCase
  ) {}

  async execute(doctorId: string, date: string): Promise<Slot[]> {
    // 1️⃣ Check cache
    const cached = await this.cache.get(doctorId, date);
    if (cached) {
      return cached;
    }

    // 2️⃣ Compute slots
    const slots = await this.computeSlots.execute(doctorId, date);

    // 3️⃣ Cache result
    await this.cache.set(doctorId, date, slots, 120);

    return slots;
  }
}
