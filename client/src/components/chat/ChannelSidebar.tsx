import { useChatStore } from "../../store/chatStore";
import { Hash, Lock, MessageCircle } from "lucide-react";

export default function ChannelSidebar() {
  const { channels, activeChannelId, setActiveChannel, onlineUsers } = useChatStore();
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col">
      <div className="px-4 py-3 border-b border-slate-700">
        <h2 className="font-bold text-white">ChatNest</h2>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <p className="px-4 py-1 text-xs text-slate-500 uppercase tracking-wide font-medium">Channels</p>
        {channels.filter(c => c.type !== "dm").map((ch) => (
          <button key={ch._id} onClick={() => setActiveChannel(ch._id)}
            className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${activeChannelId === ch._id ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>
            {ch.type === "public" ? <Hash className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span className="truncate">{ch.name}</span>
            {ch.unreadCount > 0 && <span className="ml-auto bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{ch.unreadCount}</span>}
          </button>
        ))}
        <p className="px-4 py-1 text-xs text-slate-500 uppercase tracking-wide font-medium mt-3">Direct Messages</p>
        {channels.filter(c => c.type === "dm").map((ch) => (
          <button key={ch._id} onClick={() => setActiveChannel(ch._id)}
            className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${activeChannelId === ch._id ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="truncate">{ch.name}</span>
            <span className={`ml-auto w-2 h-2 rounded-full ${onlineUsers.has(ch._id) ? "bg-green-400" : "bg-slate-600"}`} />
          </button>
        ))}
      </div>
    </aside>
  );
}
