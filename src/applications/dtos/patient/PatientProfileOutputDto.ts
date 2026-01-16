import { IPatientProfile } from "../../../domain/types/IPatientProfile";
import { UserResponse } from "../../../domain/types/IUser.types";

interface PatientProfileDTO {
  fullName: string;
  mobile: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  height: number;
  weight: number;
  state: string;
  city: string;
  pincode: string;
  address: string;
  email: string;
  profileImage: string;
}

export function mapPatientProfileToDTO(
  user: UserResponse,
  profile?: IPatientProfile | null
): PatientProfileDTO {
  return {
    fullName: user?.name ?? "",
    mobile: user?.phone ?? "",
    email: user?.email,
    profileImage: user?.profileImage,

    dateOfBirth: user?.dob ? user.dob.toISOString().split("T")[0] : "",

    gender: user?.gender ?? "",

    bloodGroup: profile?.bloodGroup ?? "",

    height: profile?.height ?? 0,
    weight: profile?.weight ?? 0,

    state: profile?.address?.state ?? "",
    city: profile?.address?.city ?? "",
    pincode: profile?.address?.pincode ?? "",
    address: profile?.address?.addressLine ?? "",
  };
}
