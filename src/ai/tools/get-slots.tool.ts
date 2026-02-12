import * as z from "zod";
import { tool } from "@langchain/core/tools";
import { GetDoctorAvailabileSlotUseCase } from "../../applications/usecases/patient/AvailableSlot/GetDoctorAvailableSlot.UseCase";
import { Slot } from "../../domain/types/Slot";

export class GetAvailableSlotsTool {
  constructor(private useCase: GetDoctorAvailabileSlotUseCase) {}

  build() {
    const schema = z.object({
      doctorId: z.string().describe("Doctor ID from search"),
      date: z.string().describe("Date YYYY-MM-DD"),
    });

    return tool(
      async ({ doctorId, date }: z.infer<typeof schema>): Promise<string> => {
        try {
          console.log("the invokey input", doctorId, date);
          const slots: Slot[] = await this.useCase.execute(doctorId, date);
          return JSON.stringify({
            success: true,
            data: slots,
            message:
              slots.length === 0
                ? "No slots available on this date."
                : `Found ${slots.filter((s) => s.available).length} available slots.`,
          });
        } catch (err: any) {
          return JSON.stringify({ success: false, error: err.message });
        }
      },
      {
        name: "get_available_slots",
        description: "Get available time slots for a doctor on a specific date.",
        schema,
      }
    );
  }
}
