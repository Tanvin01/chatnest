import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useChatStore } from "../store/chatStore";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

let socket: Socket | null = null;

export function useSocket() {
  const { token } = useAuthStore();
  const { addMessage, updateMessage, setTyping, setUserOnline, activeChannelId } = useChatStore();
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!token) return;

    socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("🔌 Socket connected");
    });

    socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        toast.error("Disconnected from server");
      }
    });

    socket.on("message_new", (message) => {
      addMessage(message);
      if (message.channelId !== activeChannelId) {
        useChatStore.getState().incrementUnread(message.channelId);
      }
    });

    socket.on("message_updated", (message) => {
      updateMessage(message);
    });

    socket.on("typing_indicator", ({ userId, channelId, typing }: { userId: string; channelId: string; typing: boolean }) => {
      setTyping(userId, channelId, typing);
    });

    socket.on("user_presence_change", ({ userId, status }: { userId: string; status: string }) => {
      setUserOnline(userId, status === "online");
    });

    return () => {
      socket?.disconnect();
      socket = null;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };
  }, [token]);

  const sendMessage = useCallback((data: {
    channelId: string;
    content: string;
    type?: string;
    replyTo?: string;
  }) => {
    socket?.emit("send_message", data);
  }, []);

  const startTyping = useCallback((channelId: string) => {
    socket?.emit("typing_start", { channelId });
  }, []);

  const stopTyping = useCallback((channelId: string) => {
    socket?.emit("typing_stop", { channelId });
  }, []);

  const markRead = useCallback((channelId: string, messageIds: string[]) => {
    socket?.emit("mark_read", { channelId, messageIds });
  }, []);

  const react = useCallback((messageId: string, emoji: string) => {
    socket?.emit("react", { messageId, emoji });
  }, []);

  return { sendMessage, startTyping, stopTyping, markRead, react, socket };
}
