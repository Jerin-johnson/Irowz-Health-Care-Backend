import {
  GetMedicalRecordWithDoctorInfoResultDTO,
  PrescriptionViewResponseDTO,
} from "../dtos/doctor/MedicalRecordPrescription.mapper";

export class MedicalRecordPrescriptionMapper {
  static toPrescriptionViewResponse(
    data: GetMedicalRecordWithDoctorInfoResultDTO
  ): PrescriptionViewResponseDTO {
    const { medicalRecord, doctorInfo } = data;

    return {
      medicalRecord: {
        appointmentId: medicalRecord.appointmentId.toString(),
        patientId: medicalRecord.patientId.toString(),
        doctorId: medicalRecord.doctorId._id.toString(),
        hospitalId: medicalRecord.hospitalId?.toString(),

        visitType: medicalRecord.visitType,
        visitDate: medicalRecord.visitDate,

        diagnosisSummary: medicalRecord.diagnosisSummary,
        observationNotes: medicalRecord.observationNotes,
        clinicalObservations: medicalRecord.clinicalObservations,

        prescriptions: medicalRecord.prescriptions.map((p) => ({
          medicineName: p.medicineName,
          dosage: p.dosage,
          frequency: p.frequency,
          duration: p.duration,
          instructions: p.instructions,
        })),

        labTests: medicalRecord.labTests.map((l) => ({
          testName: l.testName,
          description: l.description,
          reportUrl: l.reportUrl,
          status: l.status,
        })),

        followUpDate: medicalRecord.followUpDate,

        status: medicalRecord.status,
        externalUpload: medicalRecord.externalUpload,

        createdAt: medicalRecord.createdAt,
        updatedAt: medicalRecord.updatedAt,
      },

      doctorInfo: {
        name: doctorInfo.name,
        specialization: doctorInfo.specialization,
        registrationNumber: doctorInfo.medicalRegistrationNumber,
        hospital: doctorInfo.hospital
          ? `${doctorInfo.hospital.name}, ${doctorInfo.hospital.city}`
          : "",
      },
    };
  }
}
