import { RedisDoctorSpecialityCache } from "../infrastructure/cache/RedisDoctorSpecialityCache";
import { RedisDoctorAvailabilityCache } from "../infrastructure/cache/RedisSlotDoctorCache";

export const redisDoctorAvailabilityCache = new RedisDoctorAvailabilityCache();
export const redisDoctorSpecialityCache = new RedisDoctorSpecialityCache();
