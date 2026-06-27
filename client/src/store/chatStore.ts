import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface Message {
  _id: string;
  channelId: string;
  author: { _id: string; name: string; avatar?: string };
  content: string;
  type: "text" | "image" | "file";
  fileUrl?: string;
  reactions: Array<{ emoji: string; users: string[] }>;
  replyTo?: Message;
  edited: boolean;
  readBy: string[];
  createdAt: string;
}

export interface Channel {
  _id: string;
  name: string;
  description?: string;
  type: "public" | "private" | "dm";
  members: string[];
  lastMessage?: Message;
  unreadCount: number;
}

interface TypingUser {
  userId: string;
  channelId: string;
}

interface ChatState {
  channels: Channel[];
  activeChannelId: string | null;
  messages: Record<string, Message[]>;
  typingUsers: TypingUser[];
  onlineUsers: Set<string>;
  setActiveChannel: (channelId: string) => void;
  setChannels: (channels: Channel[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (message: Message) => void;
  setMessages: (channelId: string, messages: Message[]) => void;
  prependMessages: (channelId: string, messages: Message[]) => void;
  setTyping: (userId: string, channelId: string, typing: boolean) => void;
  setUserOnline: (userId: string, online: boolean) => void;
  incrementUnread: (channelId: string) => void;
  clearUnread: (channelId: string) => void;
}

export const useChatStore = create<ChatState>()(
  immer((set) => ({
    channels: [],
    activeChannelId: null,
    messages: {},
    typingUsers: [],
    onlineUsers: new Set(),

    setActiveChannel: (channelId) =>
      set((s) => { s.activeChannelId = channelId; }),

    setChannels: (channels) =>
      set((s) => { s.channels = channels; }),

    addMessage: (message) =>
      set((s) => {
        const arr = s.messages[message.channelId] ?? [];
        arr.push(message);
        s.messages[message.channelId] = arr;
      }),

    updateMessage: (message) =>
      set((s) => {
        const arr = s.messages[message.channelId];
        if (!arr) return;
        const idx = arr.findIndex((m) => m._id === message._id);
        if (idx > -1) arr[idx] = message;
      }),

    setMessages: (channelId, messages) =>
      set((s) => { s.messages[channelId] = messages; }),

    prependMessages: (channelId, messages) =>
      set((s) => {
        const arr = s.messages[channelId] ?? [];
        s.messages[channelId] = [...messages, ...arr];
      }),

    setTyping: (userId, channelId, typing) =>
      set((s) => {
        if (typing) {
          if (!s.typingUsers.find((t) => t.userId === userId && t.channelId === channelId)) {
            s.typingUsers.push({ userId, channelId });
          }
        } else {
          s.typingUsers = s.typingUsers.filter(
            (t) => !(t.userId === userId && t.channelId === channelId)
          );
        }
      }),

    setUserOnline: (userId, online) =>
      set((s) => {
        if (online) s.onlineUsers.add(userId);
        else s.onlineUsers.delete(userId);
      }),

    incrementUnread: (channelId) =>
      set((s) => {
        const ch = s.channels.find((c) => c._id === channelId);
        if (ch) ch.unreadCount += 1;
      }),

    clearUnread: (channelId) =>
      set((s) => {
        const ch = s.channels.find((c) => c._id === channelId);
        if (ch) ch.unreadCount = 0;
      }),
  }))
);
