import { Schema, Document, model } from "mongoose";
import { IUser } from "../../../../domain/types/IUser.types";
import UserRoles from "../../../../domain/constants/UserRole";

const userSchema = new Schema<IUser>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(UserRoles),
    default: UserRoles.PATIENT,
    required: true,
  },
  profileImage: { type: String },
  isBlocked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = model<IUser>("User", userSchema);

export default User;
