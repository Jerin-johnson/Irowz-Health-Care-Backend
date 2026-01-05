// export class ConfirmBookingUseCase {
//   constructor(private readonly slotLock: SlotLock) {}

//   async execute(input: {
//     doctorId: string;
//     patientId: string;
//     date: string;
//     startTime: string;
//   }): Promise<{ locked: true }> {
//     const { doctorId, patientId, date, startTime } = input;

//     const lockAcquired = await this.slotLock.acquire(doctorId, date, startTime, patientId);

//     if (!lockAcquired) {
//       throw new Error("Slot already locked or booked");
//     }

//     return { locked: true };
//   }
// }
