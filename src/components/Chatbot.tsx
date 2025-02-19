"use client";

import { useEffect, useState } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ModelSelector from "./ModelSelector";
import ResponseTypeSelector from "./ResponseTypeSelector";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chatbot() {
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [responseType, setResponseType] = useState<"normal" | "streaming">(
    "normal"
  );
  const [selectedModel, setSelectedModel] = useState("gemini");

  const sendMessage = async (message: string) => {
    setLoading(true);

    const newChat: Message[] = [...chat, { role: "user", content: message }];
    setChat(newChat);

    try {
      const apiEndpoint = `/api/${selectedModel}`;
      const payload = { message, modelType: responseType, chatHistory: chat };

      if (responseType === "streaming") {
        const res = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = "";

        setChat((prevChat) => [
          ...prevChat,
          { role: "assistant", content: "" },
        ]);

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          assistantMessage += decoder.decode(value, { stream: true });

          setChat((prevChat) =>
            prevChat.map((msg, index) =>
              index === prevChat.length - 1
                ? { ...msg, content: assistantMessage }
                : msg
            )
          );
        }
      } else {
        const res = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        setChat((prevChat) => [
          ...prevChat,
          { role: "assistant", content: data.response },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setChat([]);
  }, [selectedModel]);

  return (
    <div className="w-screen h-screen flex flex-col items-center p-4 bg-gray-50 text-black">
      <h1 className="text-2xl font-bold mb-4">AI Chatbot</h1>

      <div className="mb-4 flex gap-4">
        <ModelSelector
          selectedModel={selectedModel}
          onChange={setSelectedModel}
        />
        <ResponseTypeSelector
          responseType={responseType}
          onChange={setResponseType}
        />
      </div>

      <ChatMessages chat={chat} />
      <ChatInput onSendMessage={sendMessage} loading={loading} />
    </div>
  );
}
