import { IDoctorAvailabilityRepository } from "../../../../domain/repositories/IDoctorAvailabilityRepository";
import { IDoctorSearchRepository } from "../../../../domain/repositories/IDoctorSearchRepo";
import {
  DoctorSearchQueryDTO,
  DoctorSearchResponseDTO,
} from "../../../dtos/patient/doctor.search.Dto";

const DAY_ORDER = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export class DoctorSearchUseCase {
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
    const { items: doctors, total } = await this._searchRepo.searchDoctors(query);

    const doctorIds = doctors.map((d) => d._id);
    const availabilityMap = await this._availabilityRepo.getByDoctorIds(doctorIds);

    const today = DAY_ORDER[new Date().getDay()];

    const items: DoctorSearchResponseDTO[] = doctors.map((doctor) => {
      const availability = availabilityMap.get(doctor._id.toString());

      let isAvailableToday = false;
      let availableDays: string[] = [];

      if (availability) {
        availableDays = availability.weeklySchedule
          .filter((d: any) => d.isWorking)
          .map((d: any) => d.day);

        isAvailableToday = availability.weeklySchedule.some(
          (d: any) => d.day === today && d.isWorking
        );
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
