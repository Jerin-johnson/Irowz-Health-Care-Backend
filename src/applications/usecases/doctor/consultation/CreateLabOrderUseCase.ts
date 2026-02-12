import { IMedicalRecordRepository } from "../../../../domain/repositories/IMedicalRecordRepository";
import { IHospitalLabOrderRepository } from "../../../../domain/repositories/IHospitalLabOrderRepository";
import { CreateLabOrderInput } from "../../../dtos/doctor/CreateLabOrder.dto";

export class CreateLabOrderUseCase {
  constructor(
    private readonly _medicalRepo: IMedicalRecordRepository,
    private readonly _hospitalRepo: IHospitalLabOrderRepository
  ) {}

  async execute(input: CreateLabOrderInput) {
    const record = await this._medicalRepo.findByAppointmentId(input.appointmentId);

    if (!record) throw new Error("Medical record not found");

    if (record.status === "LOCKED") {
      throw new Error("Medical record locked");
    }

    if (
      record.labTests[0] &&
      record.labTests[0].action === "Hospital" &&
      input.action !== "Hospital"
    ) {
      throw new Error("cannot change once order is made...you think this joke hmm...");
    }

    const labTests = input.tests.map((t) => ({
      testName: t.name,
      description: t.category,
      action: input.action as "Hospital" | "Outside",
      status: "ORDERED" as "ORDERED" | "RESULT_UPLOADED" | "REVIEWED",
      orderedAt: new Date(),
    }));

    record.labTests = labTests;

    await this._medicalRepo.save(record);

    if (input.action !== "Hospital") {
      return { message: "Lab order created successfully" };
    }

    const hospitalLabOrder = await this._hospitalRepo.findByAppointmentId(input.appointmentId);

    if (!hospitalLabOrder) {
      await this._hospitalRepo.createOrder({
        appointmentId: input.appointmentId,
        hospitalId: String(record.hospitalId),
        patientId: String(record.patientId),
        doctorId: String(record.doctorId),
        tests: input.tests.map((t) => ({
          testName: t.name,
          category: t.category,
        })),
        clinicalReason: input.clinicalReason,
      });
    } else {
      hospitalLabOrder.tests = input.tests.map((t) => ({
        testName: t.name,
        category: t.category,
      }));
      hospitalLabOrder.clinicalReason = input.clinicalReason;
      await this._hospitalRepo.save(hospitalLabOrder);
    }

    return { message: "Lab order created successfully" };
  }
}
