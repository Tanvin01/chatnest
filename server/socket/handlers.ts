import { Socket } from "socket.io";
import { io, redisPublisher, redisSubscriber } from "../index";
import { Message } from "../models/Message";
import { Channel } from "../models/Channel";

export function registerSocketHandlers(socket: Socket) {
  const userId = (socket as any).userId as string;
  console.log(`🔌 User connected: ${userId}`);

  // Mark user online in Redis
  redisPublisher.set(`chatnest:online:${userId}`, "1", { EX: 86400 });
  socket.broadcast.emit("user_presence_change", { userId, status: "online" });

  // Join all user's channels
  socket.on("join_channels", async (channelIds: string[]) => {
    for (const id of channelIds) {
      socket.join(`channel:${id}`);
    }
  });

  // Send message
  socket.on("send_message", async (data: {
    channelId: string;
    content: string;
    type?: "text" | "image" | "file";
    fileUrl?: string;
    fileName?: string;
    replyTo?: string;
  }) => {
    try {
      const message = await Message.create({
        channelId: data.channelId,
        author: userId,
        content: data.content,
        type: data.type ?? "text",
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        replyTo: data.replyTo,
      });

      await message.populate("author", "name avatar");

      io.to(`channel:${data.channelId}`).emit("message_new", message.toObject());

      // Update channel lastMessage
      await Channel.findByIdAndUpdate(data.channelId, {
        lastMessage: message.id,
        lastActivityAt: new Date(),
      });
    } catch (err) {
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Typing indicators
  socket.on("typing_start", ({ channelId }: { channelId: string }) => {
    socket.to(`channel:${channelId}`).emit("typing_indicator", { userId, channelId, typing: true });
  });

  socket.on("typing_stop", ({ channelId }: { channelId: string }) => {
    socket.to(`channel:${channelId}`).emit("typing_indicator", { userId, channelId, typing: false });
  });

  // Mark messages as read
  socket.on("mark_read", async ({ channelId, messageIds }: { channelId: string; messageIds: string[] }) => {
    await Message.updateMany(
      { _id: { $in: messageIds }, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );
    socket.to(`channel:${channelId}`).emit("read_receipt", { userId, messageIds });
  });

  // Emoji reaction
  socket.on("react", async ({ messageId, emoji }: { messageId: string; emoji: string }) => {
    const message = await Message.findById(messageId);
    if (!message) return;

    const existing = message.reactions.find((r) => r.emoji === emoji);
    if (existing) {
      const idx = existing.users.findIndex((u) => u.toString() === userId);
      if (idx > -1) existing.users.splice(idx, 1);
      else existing.users.push(userId as any);
    } else {
      message.reactions.push({ emoji, users: [userId as any] });
    }

    await message.save();
    io.to(`channel:${message.channelId.toString()}`).emit("message_updated", message.toObject());
  });

  // Disconnect
  socket.on("disconnect", async () => {
    await redisPublisher.del(`chatnest:online:${userId}`);
    socket.broadcast.emit("user_presence_change", { userId, status: "offline" });
    console.log(`❌ User disconnected: ${userId}`);
  });
}
