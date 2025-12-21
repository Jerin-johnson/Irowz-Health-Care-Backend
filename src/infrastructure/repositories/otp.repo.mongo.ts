// import { OtpRepository } from "../../domain/repositories/IOtp.repo";
// import { Otp } from "../../domain/types/IOtp.types";
// import { OtpModel } from "../database/mongo/models/Otp.model";

// export class MongoOtpRepository implements OtpRepository {
//   async save(otp: Otp) {
//     await OtpModel.create(otp);
//   }
//   async findByUserId(userId: string): Promise<null | Otp> {
//     const doc = await OtpModel.findOne({ userId });
//     return doc as Otp;
//   }

//   async deleteByUserId(userId: string) {
//     await OtpModel.deleteOne({ userId });
//   }
// }
