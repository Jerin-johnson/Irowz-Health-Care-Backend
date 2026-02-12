import * as z from "zod";
import { tool } from "@langchain/core/tools";
import { IUnLockDoctorSlotUseCase } from "../../domain/usecase/patient/BookingSlots/IUnLockDoctorSlotUseCase";

export class UnlockSlotTool {
  constructor(private useCase: IUnLockDoctorSlotUseCase) {}

  build() {
    const schema = z.object({
      doctorId: z.string(),
      date: z.string(),
      startTime: z.string(),
    });

    return tool(
      async (input: z.infer<typeof schema>): Promise<string> => {
        try {
          const result = await this.useCase.execute(input);
          return JSON.stringify({
            success: result.unlocked,
            message: "Slot unlocked.",
          });
        } catch (err: any) {
          return JSON.stringify({ success: false, error: err.message });
        }
      },
      {
        name: "unlock_slot",
        description: "Unlock slot if user cancels booking.",
        schema,
      }
    );
  }
}
