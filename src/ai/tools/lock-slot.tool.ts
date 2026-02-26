import * as z from "zod";
import { tool } from "@langchain/core/tools";
import { ILockDoctorSlotUseCase } from "../../domain/usecase/patient/BookingSlots/ILockDoctorSlotUseCase";

export class LockSlotTool {
  constructor(private useCase: ILockDoctorSlotUseCase) {}

  build(userId: string) {
    const schema = z.object({
      doctorId: z.string(),
      date: z.string(),
      startTime: z.string(),
      userId: z.string(),
    });

    return tool(
      async (input: z.infer<typeof schema>): Promise<string> => {
        console.log("is this inovode lock slot userCase");
        try {
          console.log("the locked slot by agen is", { ...input, userId });
          const result = await this.useCase.execute({ ...input, userId });
          console.log("the result are ", result);
          return JSON.stringify({
            success: result.locked,
            message: result.locked ? "Slot locked for 10 minutes." : "Lock failed — slot taken.",
          });
        } catch (err) {
          return JSON.stringify({ success: false, error: err.message });
        }
      },
      {
        name: "lock_slot",
        description: "Lock a slot for 10 min before booking. Call before book_with_wallet.",
        schema,
      }
    );
  }
}
