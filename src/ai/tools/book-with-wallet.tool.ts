import * as z from "zod";
import { tool } from "@langchain/core/tools";
import { ICheckoutUseCase } from "../../domain/usecase/patient/BookingSlots/ICheckoutUseCase";
import { CheckoutInput } from "../../applications/dtos/patient/CheckoutInput";
import { PaymentMethod } from "../../domain/types/DoctorAppointment";
import { doctorRepo, walletRepo } from "../../DI/repositers";

class GetWalletBalanceUseCase {
  async execute(userId: string): Promise<{ balance: number }> {
    const wallet = await walletRepo.findByUserId(userId);
    if (!wallet) throw new Error("something went wrong in the wallet repo");
    return { balance: wallet?.balance };
  }
}

export class BookWithWalletTool {
  constructor(
    private checkoutUseCase: any,
    private walletUseCase = new GetWalletBalanceUseCase()
  ) {}

  build(userId: string) {
    const schema = z.object({
      doctorId: z.string(),
      date: z.string(),
      startTime: z.string(),
      endTime: z.string().optional(),
      visitType: z.enum(["ONLINE", "OPD"]).default("OPD"),
      patientId: z.string().describe("User ID from session"), // Added
      patientSnapshot: z.object({
        firstName: z.string(),
        lastName: z.string(),
        phone: z.string(),
        email: z.string().email(),
      }),
      addressSnapshot: z
        .object({
          country: z.string().default("India"),
          state: z.string(),
          city: z.string(),
          zip: z.string(),
          street: z.string(),
          apartment: z.string().optional(),
        })
        .optional(), // Required for OPD
      notes: z.string().optional(),
    });

    return tool(
      async (rawInput: object): Promise<string> => {
        const parsed = schema.safeParse({ ...rawInput, patientId: userId });
        if (!parsed.success) {
          return JSON.stringify({
            success: false,
            error: "Invalid input: " + parsed.error.issues.map((i) => i.message).join(", "),
            suggestion: "Missing fields — ask user for [list].",
          });
        }

        const input = parsed.data as CheckoutInput & { patientId: string }; // Ensure type

        if (input.visitType === "OPD" && !input.addressSnapshot) {
          return JSON.stringify({
            success: false,
            error: "OPD booking requires full address snapshot.",
            suggestion: "Ask user for country, state, city, zip, street.",
          });
        }

        try {
          // Check wallet
          const { balance } = await this.walletUseCase.execute(userId);
          const doctor = await doctorRepo.findById(input.doctorId);
          const fee = doctor?.consultationFee || 0;

          if (balance < fee) {
            return JSON.stringify({
              success: false,
              error: "Insufficient wallet balance.",
              details: { balance, fee, needed: fee - balance },
              suggestion: "Tell user: 'Not enough (₹" + balance + " < ₹" + fee + "). Add funds?'",
            });
          }

          // Book with WALLET
          const result = await this.checkoutUseCase.execute({
            ...input,
            paymentMethod: "WALLET" as PaymentMethod,
          });

          return JSON.stringify({
            success: true,
            data: result,
            message: "Booking successful with wallet deduction.",
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "";
          return JSON.stringify({ success: false, error: message });
        }
      },
      {
        name: "book_with_wallet",
        description:
          "Book appointment with WALLET only. Check balance first, confirm in conversation. Use after lock_slot. when the patient ask to book the appointment first lock the appointment and pass the startTime doctorId endTime date the booking tool with all other infomration need",
        schema,
      }
    );
  }
}
