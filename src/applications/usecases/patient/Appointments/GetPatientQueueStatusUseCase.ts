import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { IDoctorAvailabilityRepository } from "../../../../domain/repositories/IDoctorAvailabilityRepository";
import { IGetPatientQueueStatusUseCase } from "../../../../domain/usecase/patient/Appointments/IGetPatientQueueStatusUseCase";

// import { IGetPatientQueueStatusUseCase } from "../../../../domain/usecase/patient/Appointments/IGetPatientQueueStatusUseCase";
import { timeToMinutes } from "../../../../domain/utils/time.utils";

// type PatientState =
//   | "ONGOING"
//   | "NEXT"
//   | "WAITING"
//   | "NOT_IN_QUEUE"
//   | "COMPLETED"
//   | "CANCELLED"
//   | "NO_SHOW";

type WeekDay = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

function getTodayDay(): WeekDay {
  return ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][new Date().getDay()] as WeekDay;
}

type DoctorStatus = "NOT_STARTED" | "CONSULTING" | "ON_LUNCH_BREAK";

export class GetPatientQueueStatusUseCase implements IGetPatientQueueStatusUseCase {
  constructor(
    private readonly availabilityRepo: IDoctorAvailabilityRepository,
    private readonly appointmentRepo: IDoctorAppointmentRepository
  ) {}

  async execute(appointmentId: string, today: string) {
    const appointment = await this.appointmentRepo.findById(appointmentId);
    if (!appointment) throw new Error("Appointment not found");

    if (appointment.date !== today) {
      return {
        appointmentId,
        status: appointment.status,
        queuePosition: null,
        patientsAhead: null,
        estimatedWaitMinutes: null,
        patientState: "NOT_IN_QUEUE",
        message: "Live queue available only on appointment day",
      } as const;
    }

    if (["COMPLETED", "CANCELLED", "NO_SHOW"].includes(String(appointment?.status))) {
      return {
        appointmentId,
        status: appointment.status,
        patientState: appointment.status,
        queuePosition: null,
        patientsAhead: null,
        estimatedWaitMinutes: null,
      } as const;
    }

    const availability = await this.availabilityRepo.findByDoctorId(String(appointment.doctorId));

    const appointments = await this.appointmentRepo.getDoctorAppointmentsForDay(
      String(appointment.doctorId),
      today
    );

    const current = appointments.find((a) => a.status === "STARTED");

    const waitingQueue = appointments
      .filter((a) => a.status === "BOOKED")
      .sort((a, b) => a.queuePriority - b.queuePriority);

    // Patient currently in consultation
    if (appointment.status === "STARTED") {
      return {
        appointmentId,
        status: appointment.status,
        patientState: "ONGOING",
        doctorStatus: "CONSULTING",
        queuePosition: 0,
        patientsAhead: 0,
        estimatedWaitMinutes: 0,
      } as const;
    }

    const index = waitingQueue.findIndex((a) => String(a._id) === appointmentId);

    if (index === -1) {
      return {
        appointmentId,
        status: appointment.status,
        patientState: "NOT_IN_QUEUE",
        queuePosition: null,
        patientsAhead: null,
        estimatedWaitMinutes: null,
      } as const;
    }

    const queuePosition = index + 1;
    const patientsAhead = index;

    // Doctor not started consultation yet
    if (!current && !availability?.doctorDelayedAt) {
      return {
        appointmentId,
        status: appointment.status,
        patientState: queuePosition === 1 ? "NEXT" : "WAITING",
        doctorStatus: "NOT_STARTED",
        queuePosition,
        patientsAhead,
        estimatedWaitMinutes: null,
        message: "Doctor has not started consultations yet",
      } as const;
    }

    // ---- ETA calculation ----
    const slotDuration = Number(availability?.slotDurationMinutes || 15);
    let estimatedWaitMinutes = patientsAhead * slotDuration;

    // Add doctor delay
    if (availability?.doctorDelayMinutes) {
      estimatedWaitMinutes += availability.doctorDelayMinutes;
    }

    // ---- Lunch break logic ----
    const todaySchedule = availability?.weeklySchedule.find((d) => d.day === getTodayDay());

    let doctorStatus: DoctorStatus = "CONSULTING";

    if (todaySchedule?.breakTime) {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      const breakStart = timeToMinutes(todaySchedule.breakTime.start);
      const breakEnd = timeToMinutes(todaySchedule.breakTime.end);
      const breakDuration = breakEnd - breakStart;

      // Doctor is currently in lunch break
      if (nowMinutes >= breakStart && nowMinutes < breakEnd) {
        doctorStatus = "ON_LUNCH_BREAK";
        estimatedWaitMinutes += breakEnd - nowMinutes;
      } else {
        const expectedStart = nowMinutes + estimatedWaitMinutes;

        // Consultation will cross lunch break
        if (expectedStart >= breakStart) {
          estimatedWaitMinutes += breakDuration;
        }
      }
    }

    const isNext = !current && queuePosition === 1;

    return {
      appointmentId,
      status: appointment.status,
      patientState: isNext ? "NEXT" : "WAITING",
      doctorStatus,
      queuePosition,
      patientsAhead,
      estimatedWaitMinutes,
      patientInfo: {
        name: appointment.patientSnapshot?.firstName,
        appointmentDate: appointment.date,
        appointmentTime: appointment.startTime,
      } as const,
    };
  }
}
