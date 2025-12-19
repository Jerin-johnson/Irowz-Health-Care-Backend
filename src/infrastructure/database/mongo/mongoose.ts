import { Document, Types, Schema, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  avatar?: string;
  organization: Types.ObjectId; // For referencing other documents
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String,
  organization: { type: Schema.Types.ObjectId, ref: "Organization" },
});

const User = model<IUser>("User", userSchema);
export default User;
