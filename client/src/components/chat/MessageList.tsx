import { useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import type { Message } from "../../store/chatStore";

interface Props { messages: Message[]; currentUserId: string; }

export default function MessageList({ messages, currentUserId }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messages.map((msg) => {
        const isOwn = msg.author._id === currentUserId;
        return (
          <div key={msg._id} className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {msg.author.name.charAt(0).toUpperCase()}
            </div>
            <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
              <div className={`rounded-2xl px-4 py-2 text-sm ${isOwn ? "bg-blue-600 text-white rounded-br-sm" : "bg-slate-800 text-slate-100 rounded-bl-sm"}`}>
                {msg.content}
              </div>
              <span className="text-xs text-slate-500 mt-1 px-1">
                {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
