import mongoose, { Schema, Document } from "mongoose";
export interface IChannel extends Document {
  name: string; description?: string; type: "public"|"private"|"dm";
  members: mongoose.Types.ObjectId[]; createdBy: mongoose.Types.ObjectId;
  lastMessage?: mongoose.Types.ObjectId; lastActivityAt: Date;
}
const ChannelSchema = new Schema<IChannel>({
  name: { type: String, required: true },
  description: String,
  type: { type: String, enum: ["public","private","dm"], default: "public" },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  lastActivityAt: { type: Date, default: Date.now },
}, { timestamps: true });
export const Channel = mongoose.model<IChannel>("Channel", ChannelSchema);
