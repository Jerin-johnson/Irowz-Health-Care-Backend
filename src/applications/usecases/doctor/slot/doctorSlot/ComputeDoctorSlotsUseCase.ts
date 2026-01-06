// import { DoctorBlockedDateRepository } from "../../../../../domain/repositories/DoctorBlockedDateRepository";
// import { BookedSlotRepository } from "../../../../../domain/repositories/IBookedSlotRepository";
// import { Slot } from "../../../../../domain/types/Slot";
// import { MongoDoctorAvailabilityRepository } from "../../../../../infrastructure/repositories/DoctorAvailability.Repository";
// import { addMinutes, isTimeInRange } from "../../../../../domain/utils/time.utils";

// export class ComputeDoctorSlotsUseCase {
//   constructor(
//     private readonly availabilityRepo: MongoDoctorAvailabilityRepository,
//     private readonly bookedSlotRepo: BookedSlotRepository,
//     private readonly blockedDateRepo: DoctorBlockedDateRepository
//   ) {}

//   async execute(doctorId: string, date: string): Promise<Slot[]> {
//     // 1️⃣ Check blocked date
//     const isBlocked = await this.blockedDateRepo.isDateBlocked(doctorId, date);

//     if (isBlocked) {
//       return [];
//     }

//     // 2️⃣ Fetch availability rules
//     const availability = await this.availabilityRepo.findByDoctorId(doctorId);

//     if (!availability) {
//       throw new Error("Doctor availability not configured");
//     }

//     // 3️⃣ Validate working day
//     const dayOfWeek = this.getDayOfWeek(date);
//     if (!availability.workingDays.includes(dayOfWeek)) {
//       return [];
//     }

//     // 4️⃣ Fetch booked slots
//     const bookedSlots = await this.bookedSlotRepo.findBookedSlots(doctorId, date);

//     const bookedStartTimes = new Set(bookedSlots.map((s) => s.startTime));

//     // 5️⃣ Generate virtual slots
//     const slots: Slot[] = [];

//     let cursor = availability.workingStartTime;

//     while (
//       addMinutes(cursor, availability.averageConsultationTime) <= availability.workingEndTime
//     ) {
//       // Skip lunch break
//       if (isTimeInRange(cursor, availability.lunchStartTime, availability.lunchEndTime)) {
//         cursor = addMinutes(cursor, availability.averageConsultationTime);
//         continue;
//       }

//       const status = bookedStartTimes.has(cursor) ? "BOOKED" : "AVAILABLE";

//       slots.push({
//         startTime: cursor,
//         endTime: addMinutes(cursor, availability.averageConsultationTime),
//         status,
//       });

//       cursor = addMinutes(cursor, availability.averageConsultationTime);
//     }

//     // 6️⃣ Enforce max patients per day
//     return slots.slice(0, availability.maxPatientsPerDay);
//   }

//   private getDayOfWeek(date: string) {
//     const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
//     return days[new Date(date).getDay()];
//   }
// }
