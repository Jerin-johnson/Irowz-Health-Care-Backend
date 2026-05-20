import { calculateAge, calculateBMI } from "../../utils/patient.utils";

interface MapPatientToDTOInput {
  dob?: Date | string;
  gender?: string;

  patientProfile?: {
    userId?: string;

    height?: number;

    weight?: number;

    bloodGroup?: string;

    allergies?: string[];

    chronicConditions?: string[];

    address?: {
      city?: string;
    };
  };

  appoinment: {
    visitType: string;

    date: string | Date;

    startTime: string;

    queuePriority: number;

    status?: string;

    patientSnapshot: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
    };

    addressSnapshot?: {
      city?: string;
    };
  };
}

export function mapPatientToDTO(response: MapPatientToDTOInput) {
  const { patientProfile, appoinment, dob, gender } = response;

  const height = patientProfile?.height ?? 0;
  const weight = patientProfile?.weight ?? 0;

  return {
    id: patientProfile?.userId,

    fullName: `${appoinment.patientSnapshot.firstName} ${appoinment.patientSnapshot.lastName}`,

    age: calculateAge(dob as string),

    gender: gender ?? "",

    bloodGroup: patientProfile?.bloodGroup ?? "",

    height,

    weight,

    bmi: calculateBMI(weight, height),

    // Not available in payload → default / placeholder
    bp: "N/A",

    phone: appoinment.patientSnapshot.phone,

    email: appoinment.patientSnapshot.email,

    city: patientProfile?.address?.city || appoinment?.addressSnapshot?.city || "",

    allergies: patientProfile?.allergies ?? [],

    chronicConditions: patientProfile?.chronicConditions ?? [],

    visitType: appoinment.visitType,

    visitTime: `${appoinment.date} ${appoinment.startTime}`,

    queue: appoinment.queuePriority,

    status: appoinment?.status,
  };
}
