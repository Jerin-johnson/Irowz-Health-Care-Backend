// import { AppointmentRepository } from "../../domain/repositories/AppointmentRepository";
// import { BookedSlotRepository } from "../../domain/repositories/BookedSlotRepository";
// import { SlotLock } from "../../domain/lock/SlotLock";
// import mongoose from "mongoose";

// export class FinalizeBookingUseCase {
//   constructor(
//     private readonly appointmentRepo: AppointmentRepository,
//     private readonly bookedSlotRepo: BookedSlotRepository,
//     private readonly slotLock: SlotLock
//   ) {}

//   async execute(input: {
//     doctorId: string;
//     patientId: string;
//     date: string;
//     startTime: string;
//     endTime: string;
//     visitType: "ONLINE" | "OFFLINE";
//     amount: number;
//   }) {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       const {
//         doctorId,
//         patientId,
//         date,
//         startTime,
//         endTime,
//         visitType,
//         amount,
//       } = input;

//       // 1️⃣ Prevent double booking at DB level
//       const alreadyBooked = await this.bookedSlotRepo.exists(
//         doctorId,
//         date,
//         startTime
//       );

//       if (alreadyBooked) {
//         throw new Error("Slot already booked");
//       }

//       // 2️⃣ Create appointment
//       const appointment = await this.appointmentRepo.create({
//         doctorId,
//         patientId,
//         date,
//         startTime,
//         endTime,
//         mode: visitType,
//         status: "CONFIRMED",
//         payment: {
//           amount,
//           status: "PAID",
//         },
//       });

//       // 3️⃣ Insert booked slot
//       await this.bookedSlotRepo.create(
//         doctorId,
//         date,
//         startTime,
//         endTime,
//         appointment.id
//       );

//       await session.commitTransaction();

//       // 4️⃣ Release Redis lock
//       await this.slotLock.release(
//         doctorId,
//         date,
//         startTime,
//         patientId
//       );

//       return appointment;
//     } catch (error) {
//       await session.abortTransaction();
//       throw error;
//     } finally {
//       session.endSession();
//     }
//   }
// }
