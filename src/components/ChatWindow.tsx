import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

interface ChatWindowProps {
  chat: { role: string; content: string }[];
}

export default function ChatWindow({ chat }: ChatWindowProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 w-full max-w-2xl p-4 border bg-white shadow rounded-lg overflow-y-auto"
    >
      {chat.map((msg, index) => (
        <ChatMessage
          key={index}
          role={msg.role as "user" | "assistant"}
          content={msg.content}
        />
      ))}
    </div>
  );
}
