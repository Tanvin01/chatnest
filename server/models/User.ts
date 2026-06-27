import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
export interface IUser extends Document {
  name: string; email: string; password: string; avatar?: string;
  status: "online"|"away"|"offline"; lastSeen: Date;
  comparePassword(p: string): Promise<boolean>;
}
const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  avatar: String,
  status: { type: String, enum: ["online","away","offline"], default: "offline" },
  lastSeen: { type: Date, default: Date.now },
}, { timestamps: true });
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12); next();
});
UserSchema.methods.comparePassword = function(p: string) { return bcrypt.compare(p, this.password); };
export const User = mongoose.model<IUser>("User", UserSchema);
