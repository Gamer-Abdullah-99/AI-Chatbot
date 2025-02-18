"use client";
import { useState } from "react";
import ChatWindow from "./ChatWindow";
import InputBox from "./InputBox";
import ModelSelector from "./ModelSelector";

export default function Chatbot() {
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
  const [modelType, setModelType] = useState<"regular" | "streaming">(
    "regular"
  );
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    const newChat = [...chat, { role: "user", content: message }];
    setChat(newChat);
    setMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, modelType, chatHistory: newChat }),
      });

      if (!res.body) throw new Error("No response body");

      if (modelType === "streaming") {
        // Handle Streaming Response
        const reader = res.body.getReader();
        let botResponse = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          botResponse += new TextDecoder().decode(value);
          setChat([...newChat, { role: "assistant", content: botResponse }]);
        }
      } else {
        // Handle Regular Response
        const data = await res.json();
        setChat([...newChat, { role: "assistant", content: data.response }]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">AI Chatbot</h1>
      <ChatWindow chat={chat} />
      <div className="w-full max-w-2xl mt-4 flex items-center gap-2">
        <InputBox
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          loading={loading}
        />
        <ModelSelector modelType={modelType} setModelType={setModelType} />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="p-2 bg-blue-500 text-white rounded-lg"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
