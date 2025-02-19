import { useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessagesProps {
  chat: Message[];
}

export default function ChatMessages({ chat }: ChatMessagesProps) {
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
      className="flex-1 w-full w-full p-4 border bg-white shadow rounded-lg overflow-y-auto"
    >
      {chat.map((msg, index) => (
        <div
          key={index}
          className={`w-fit max-w-[80%] p-2 mb-2 rounded-lg ${
            msg.role === "user"
              ? "ml-auto bg-blue-500 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}
