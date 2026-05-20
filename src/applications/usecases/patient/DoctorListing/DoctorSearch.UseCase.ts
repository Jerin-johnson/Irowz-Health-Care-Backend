// import { Doc } from "zod/v4/core";
import { IDoctorAvailabilityRepository } from "../../../../domain/repositories/IDoctorAvailabilityRepository";
import { IDoctorSearchRepository } from "../../../../domain/repositories/IDoctorSearchRepo";
import { IDoctorSearchUseCase } from "../../../../domain/usecase/patient/DoctorListing/IDoctorSearchUseCase";
import {
  DoctorSearchQueryDTO,
  DoctorSearchResponseDTO,
} from "../../../dtos/patient/doctor.search.Dto";
// import { DoctorAvailability } from "../../../../domain/types/DoctorAvailability";

const DAY_ORDER = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export class DoctorSearchUseCase implements IDoctorSearchUseCase {
  constructor(
    private readonly _searchRepo: IDoctorSearchRepository,
    private readonly _availabilityRepo: IDoctorAvailabilityRepository
  ) {}

  async execute(query: DoctorSearchQueryDTO): Promise<{
    items: DoctorSearchResponseDTO[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    console.log("the query get to the usecase is ", query);
    const { items: doctors, total } = await this._searchRepo.searchDoctors(query);

    const doctorIds = doctors.map((d) => d._id);
    const availabilityMap = await this._availabilityRepo.getByDoctorIds(doctorIds);

    const today = DAY_ORDER[new Date().getDay()];

    const items: DoctorSearchResponseDTO[] = doctors.map((doctor) => {
      const availability = availabilityMap.get(doctor._id.toString());

      let isAvailableToday = false;
      let availableDays: string[] = [];

      if (availability) {
        availableDays = availability.weeklySchedule.filter((d) => d.isWorking).map((d) => d.day);

        isAvailableToday = availability.weeklySchedule.some((d) => d.day === today && d.isWorking);
      }

      return {
        id: doctor._id.toString(),
        fullName: doctor.user?.name,
        email: doctor.user.email,
        profileImage: doctor.user?.profileImage,
        specialtyId: doctor.specialty._id,
        consultationFee: doctor.consultationFee,
        experienceYears: doctor.experienceYears,
        averageRating: doctor.averageRating,
        totalReviews: doctor.totalReviews,
        hospitalName: doctor.hospital.name,
        hospitalCity: doctor.hospital.city,
        specialtyName: doctor.specialty.name,
        distance: doctor.distance,
        isAvailableToday,
        availableDays,
      };
    });

    return {
      items,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }
}
