import { HospitalVerificationRepositoryImpl } from "../infrastructure/repositories/HospitalVerification.repository";
import { MongoUserRepository } from "../infrastructure/repositories/user.repo.mongo";
import { HospitalRepositoryImpl } from "../infrastructure/repositories/Hospital.repository";
import { HospitalSpecialtyModel } from "../infrastructure/database/mongo/models/HospitalSpeciality.model";
import { HospitalSpecialtyRepositoryImpl } from "../infrastructure/repositories/HospitalSpeciality.repo";

export const mongoUserRepository = new MongoUserRepository();
export const hosptialVerficatinRepo = new HospitalVerificationRepositoryImpl();
export const hosptialRepository = new HospitalRepositoryImpl();
export const hospitalSpecialityRepo = new HospitalSpecialtyRepositoryImpl();
