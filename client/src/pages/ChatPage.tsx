import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import { useSocket } from "../hooks/useSocket";
import ChannelSidebar from "../components/chat/ChannelSidebar";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import axios from "axios";
export default function ChatPage() {
  const { token, user } = useAuthStore();
  const { activeChannelId, setChannels, messages } = useChatStore();
  useSocket();
  useEffect(() => {
    if (!token) return;
    axios.get(`${import.meta.env.VITE_API_URL}/api/channels`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setChannels(r.data));
  }, [token]);
  const currentMessages = activeChannelId ? (messages[activeChannelId] ?? []) : [];
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <ChannelSidebar />
      <main className="flex-1 flex flex-col">
        {activeChannelId ? (
          <>
            <MessageList messages={currentMessages} currentUserId={user?._id ?? ""} />
            <MessageInput channelId={activeChannelId} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">Select a channel to start chatting</div>
        )}
      </main>
    </div>
  );
}
