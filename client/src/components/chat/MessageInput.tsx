"use client";
import { useState, useRef, useCallback } from "react";
import { useSocket } from "../../hooks/useSocket";
import { Send, Paperclip } from "lucide-react";

interface Props { channelId: string; }

export default function MessageInput({ channelId }: Props) {
  const [text, setText] = useState("");
  const { sendMessage, startTyping, stopTyping } = useSocket();
  const typingTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    startTyping(channelId);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => stopTyping(channelId), 1500);
  };

  const handleSend = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage({ channelId, content: text.trim() });
    setText("");
    stopTyping(channelId);
  }, [text, channelId, sendMessage, stopTyping]);

  return (
    <form onSubmit={handleSend} className="flex items-center gap-2 p-4 border-t border-slate-700 bg-slate-900">
      <button type="button" className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700">
        <Paperclip className="w-4 h-4" />
      </button>
      <input value={text} onChange={handleTyping} placeholder="Type a message..." autoComplete="off"
        className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
      <button type="submit" disabled={!text.trim()}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 p-2 rounded-xl transition-colors">
        <Send className="w-4 h-4 text-white" />
      </button>
    </form>
  );
}
