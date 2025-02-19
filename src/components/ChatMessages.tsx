import { useEffect, useRef } from "react";

interface ChatMessagesProps {
  chat: { role: string; content: string }[];
}

export default function ChatMessages({ chat }: ChatMessagesProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const formatMessage = (text: string) => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    return text.split(codeBlockRegex).map((part, index) =>
      index % 2 === 1 ? (
        <pre key={index} className="bg-gray-800 text-white p-2 rounded-md overflow-x-auto">
          <code>{part}</code>
        </pre>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 w-full max-w-2xl p-4 border bg-white shadow rounded-lg overflow-y-auto"
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
          {formatMessage(msg.content)}
        </div>
      ))}
    </div>
  );
}
