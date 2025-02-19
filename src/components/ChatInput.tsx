import { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
}

export default function ChatInput({ onSendMessage, loading }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mt-4 flex items-center gap-2"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-2 border rounded-lg"
      />
      <button
        type="submit"
        disabled={loading}
        className="p-2 bg-blue-500 text-white rounded-lg"
      >
        {loading ? "..." : "Send"}
      </button>
    </form>
  );
}
