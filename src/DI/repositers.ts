import { HospitalVerificationRepositoryImpl } from "../infrastructure/repositories/HospitalVerification.repository";
import { MongoUserRepository } from "../infrastructure/repositories/user.repo.mongo";
import { HospitalRepositoryImpl } from "../infrastructure/repositories/Hospital.repository";

export const mongoUserRepository = new MongoUserRepository();
export const hosptialVerficatinRepo = new HospitalVerificationRepositoryImpl();
export const hosptialRepository = new HospitalRepositoryImpl();
