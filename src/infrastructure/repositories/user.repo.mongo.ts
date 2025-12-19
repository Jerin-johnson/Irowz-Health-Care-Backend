import { UserRepository } from "../../domain/repositories/IUser.repo";
import {
  createUser,
  updateUser,
  UserResponse,
} from "../../domain/types/IUser.types";
import User from "../database/mongo/models/User.model";

export class MongoUserRepository implements UserRepository {
  async create(user: createUser): Promise<UserResponse | null> {
    const doc = new User({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isBlocked: user.isBlocked,
      isVerified: user.isVerified,
    });

    return await doc.save();
  }

  async findAll(): Promise<UserResponse[] | []> {
    const doc = await User.find();

    return doc;
  }

  async findByEmail(email: string): Promise<UserResponse | null> {
    const doc = await User.findOne({ email });
    return doc;
  }

  async findById(id: string): Promise<UserResponse | null> {
    const doc = await User.findOne({ _id: id });
    return doc;
  }

  async updateUser(user: updateUser): Promise<null | UserResponse> {
    const doc = await User.findByIdAndUpdate(user._id, user, { new: true });
    return doc;
  }
}
