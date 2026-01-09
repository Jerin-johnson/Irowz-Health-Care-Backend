import { IHospitalSpecialtyRepository } from "../../../../domain/repositories/IHospitalSpecaility.repo";
import { RedisDoctorSpecialityCache } from "../../../../infrastructure/cache/RedisDoctorSpecialityCache";

export class GetAvailableSpecialityUseCase {
  constructor(
    private readonly _HospitalSpecialty: IHospitalSpecialtyRepository,
    private readonly _RedisDoctorSpecialityCache: RedisDoctorSpecialityCache
  ) {}

  async execute() {
    const cacheResult = await this._RedisDoctorSpecialityCache.get();

    if (cacheResult) {
      console.log("From cache", cacheResult);
      return cacheResult;
    }

    const result = await this._HospitalSpecialty.getAllUSpecialityUnquie();

    await this._RedisDoctorSpecialityCache.set(result);
    return result;
  }
}
