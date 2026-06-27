import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  channelId: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  type: "text" | "image" | "file";
  fileUrl?: string;
  fileName?: string;
  reactions: Array<{ emoji: string; users: mongoose.Types.ObjectId[] }>;
  replyTo?: mongoose.Types.ObjectId;
  edited: boolean;
  editedAt?: Date;
  readBy: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    channelId: { type: Schema.Types.ObjectId, ref: "Channel", required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 4000 },
    type: { type: String, enum: ["text", "image", "file"], default: "text" },
    fileUrl: String,
    fileName: String,
    reactions: [
      {
        emoji: { type: String, required: true },
        users: [{ type: Schema.Types.ObjectId, ref: "User" }],
      },
    ],
    replyTo: { type: Schema.Types.ObjectId, ref: "Message" },
    edited: { type: Boolean, default: false },
    editedAt: Date,
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Compound index for efficient channel message queries
MessageSchema.index({ channelId: 1, createdAt: -1 });

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
