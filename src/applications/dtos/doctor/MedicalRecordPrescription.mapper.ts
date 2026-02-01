// import { Types } from "mongoose";

import { MedicalRecordDocument } from "../../../infrastructure/database/mongo/models/MedicalRecord.model";

export interface BackendHospitalInfoDTO {
  name: string;
  city: string;
  state: string;
  address?: string;
}

export interface BackendDoctorInfoDTO {
  name: string;
  email: string;
  phone: string;
  specialization: string; // specialtyId (can be mapped later)
  medicalRegistrationNumber: string;
  medicalCouncil: "MCI" | "NMC" | "STATE_MEDICAL_COUNCIL";
  experienceYears: number;
  hospital?: BackendHospitalInfoDTO;
}

export interface GetMedicalRecordWithDoctorInfoResultDTO {
  medicalRecord: MedicalRecordDocument;
  doctorInfo: BackendDoctorInfoDTO;
}

export interface Prescription {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface LabTest {
  testName: string;
  description?: string;
  reportUrl?: string;
  status: "ORDERED" | "RECEIVED";
}

export interface MedicalRecordResponseDTO {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  hospitalId?: string;

  visitType: "OPD" | "ONLINE";
  visitDate: Date;

  diagnosisSummary?: string;
  observationNotes?: string;
  clinicalObservations?: string;

  prescriptions: Prescription[];
  labTests: LabTest[];

  followUpDate?: Date;

  status: "DRAFT" | "COMPLETED" | "LOCKED";
  externalUpload: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorInfoResponseDTO {
  name: string;
  specialization: string;
  registrationNumber: string;
  hospital: string;
}

export interface PrescriptionViewResponseDTO {
  medicalRecord: MedicalRecordResponseDTO;
  doctorInfo: DoctorInfoResponseDTO;
}

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
