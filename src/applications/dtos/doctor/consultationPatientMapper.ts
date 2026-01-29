import { calculateAge, calculateBMI } from "../../utils/patient.utils";

export function mapPatientToDTO(response: any) {
  const { patientProfile, appoinment, dob, gender } = response;

  const height = patientProfile.height ?? 0;
  const weight = patientProfile.weight ?? 0;

  return {
    id: patientProfile.userId,

    fullName: `${appoinment.patientSnapshot.firstName} ${appoinment.patientSnapshot.lastName}`,

    age: calculateAge(dob),

    gender: gender ?? "",

    bloodGroup: patientProfile.bloodGroup ?? "",

    height,

    weight,

    bmi: calculateBMI(weight, height),

    // Not available in payload → default / placeholder
    bp: "N/A",

    phone: appoinment.patientSnapshot.phone,

    email: appoinment.patientSnapshot.email,

    city: patientProfile.address?.city || appoinment.addressSnapshot?.city || "",

    allergies: patientProfile.allergies ?? [],

    chronicConditions: patientProfile.chronicConditions ?? [],

    visitType: appoinment.visitType,

    visitTime: `${appoinment.date} ${appoinment.startTime}`,

    queue: appoinment.queuePriority,

    status: appoinment.status,
  };
}
