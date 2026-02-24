import { IHospitalLabOrderRepository } from "../../../../domain/repositories/IHospitalLabOrderRepository";
import { IMedicalRecordRepository } from "../../../../domain/repositories/IMedicalRecordRepository";
import { IFileStorage } from "../../../../domain/storage/IFile.storage";
import { IUploadHospitalLabTestUseCase } from "../../../../domain/usecase/hosptialAdmin/labOrders/IUploadHospitalLabTestUseCase";
import { UploadHospitalLabResultInput } from "../../../dtos/hosptial/labOrder.dto";

export class UploadHospitalLabTestUseCase implements IUploadHospitalLabTestUseCase {
  constructor(
    private readonly hospitalRepo: IHospitalLabOrderRepository,
    private readonly medicalRepo: IMedicalRecordRepository,
    private readonly fileStorage: IFileStorage
  ) {}

  async execute(input: UploadHospitalLabResultInput) {
    const order = await this.hospitalRepo.findById(input.orderId);

    if (!order) throw new Error("Lab order not found");

    const key = `lab-results/${input.appointmentId}/${input.testName}-${Date.now()}.pdf`;

    const storedKey = await this.fileStorage.uploadPrivatePdf({
      buffer: input.fileBuffer,
      key,
      mimeType: input.mimeType,
    });

    await this.medicalRepo.updateSingleLabTestResult({
      appointmentId: input.appointmentId,
      testName: input.testName,
      reportUrl: storedKey,
    });

    const record = await this.medicalRepo.findByAppointmentId(input.appointmentId);

    if (!record) throw new Error("something went wrong in record");

    const hospitalTests = record.labTests.filter((t) => t.action === "Hospital");

    const completed = hospitalTests.filter((t) => t.status === "RESULT_UPLOADED");

    if (hospitalTests.length === completed.length) {
      await this.hospitalRepo.markCompleted(input.orderId);
    }

    return { message: "Lab result uploaded successfully" };
  }
}
