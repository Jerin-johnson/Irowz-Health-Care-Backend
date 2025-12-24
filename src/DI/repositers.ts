import { HospitalVerificationRepositoryImpl } from "../infrastructure/repositories/HospitalVerification.repository";
import { MongoUserRepository } from "../infrastructure/repositories/user.repo.mongo";

export const mongoUserRepository = new MongoUserRepository();
export const hosptialVerficatinRepo = new HospitalVerificationRepositoryImpl();
