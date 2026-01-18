import { IUserRepository } from "../../domain/repositories/IUser.repo";
import { createUser, updateUser, UserResponse } from "../../domain/types/IUser.types";
import User from "../database/mongo/models/User.model";

export class MongoUserRepository implements IUserRepository {
  async create(user: createUser): Promise<UserResponse | null> {
    const doc = new User({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      role: user.role,
      isBlocked: user.isBlocked,
      isVerified: user.isVerified,
      forcePasswordReset: user.forcePasswordReset || false,
    });

    return await doc.save();
  }

  async findAll(): Promise<UserResponse[] | []> {
    const doc = await User.find();

    return doc;
  }

  async findByEmail(email: string, phone: string | number): Promise<UserResponse | null> {
    const doc = await User.findOne({
      $or: [{ email }, { phone: String(phone) }],
    });

    console.log("doc from", doc);
    return doc;
  }

  async findById(id: string): Promise<UserResponse | null> {
    const doc = await User.findOne({ _id: id });
    return doc;
  }

  async updateUser(user: updateUser): Promise<null | UserResponse> {
    const { _id, ...updateFields } = user;

    if (!_id) {
      throw new Error("User ID is required for update");
    }

    const doc = await User.findByIdAndUpdate(_id, updateFields, { new: true });
    return doc;
  }

  async markVerified(userId: string): Promise<void> {
    await User.updateOne({ _id: userId }, { isVerified: true });
  }

  async BlockByUserId(userId: string, status: boolean): Promise<void> {
    await User.updateOne({ _id: userId }, { isBlocked: status });
  }

  async saveForgetPasswordToken(
    email: string,
    data: { resetPasswordToken: string; resetPasswordExpires: Date }
  ): Promise<any> {
    const result = await User.updateOne({ email }, { $set: data });

    return {
      success: result.modifiedCount > 0,
      matched: result.matchedCount > 0,
    };
  }

  async findOneByResetPasswordToken(resetPasswordToken: string): Promise<UserResponse | null> {
    return await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
  }
}
